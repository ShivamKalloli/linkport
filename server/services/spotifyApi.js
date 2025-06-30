import axios from 'axios';
import { apiKeys } from '../config/apiKeys.js';

let spotifyToken = null;
let tokenExpiry = null;

/**
 * Get Spotify access token using Client Credentials flow
 */
async function getSpotifyToken() {
  if (spotifyToken && tokenExpiry && Date.now() < tokenExpiry) {
    return spotifyToken;
  }

  try {
    const credentials = Buffer.from(
      `${apiKeys.spotify.clientId}:${apiKeys.spotify.clientSecret}`
    ).toString('base64');

    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    spotifyToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000; // 1 minute buffer

    console.log('✅ Spotify token obtained');
    return spotifyToken;
  } catch (error) {
    console.error('❌ Failed to get Spotify token:');
    console.error('HTTP Status:', error.response?.status);
    console.error('Response Data:', error.response?.data);
    console.error('Error Message:', error.message);
    throw new Error('Failed to authenticate with Spotify');
  }
}

/**
 * Parse Spotify playlist using real API
 */
export async function parseSpotifyPlaylist(url) {
  try {
    console.log('🔍 Parsing Spotify URL:', url);
    
    const playlistId = extractSpotifyPlaylistId(url);
    if (!playlistId) {
      console.error('❌ Invalid Spotify playlist URL format:', url);
      throw new Error('Invalid Spotify playlist URL format. Please use a valid Spotify playlist URL like: https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M');
    }

    console.log('📋 Extracted playlist ID:', playlistId);

    const token = await getSpotifyToken();
    
    // Get playlist details
    console.log('🔄 Fetching playlist details from Spotify API...');
    console.log('🔗 Request URL:', `https://api.spotify.com/v1/playlists/${playlistId}`);
    
    const playlistResponse = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: {
          fields: 'name,description,tracks.items(track(name,artists(name),album(name),duration_ms)),tracks.total,public',
        },
      }
    );

    const playlist = playlistResponse.data;
    console.log('📊 Playlist found:', {
      name: playlist.name,
      totalTracks: playlist.tracks.total,
      isPublic: playlist.public
    });
    
    // Handle pagination for large playlists
    let allTracks = playlist.tracks.items;
    let nextUrl = playlist.tracks.next;
    
    while (nextUrl && allTracks.length < 100) { // Limit to 100 songs for demo
      console.log('📄 Fetching additional tracks...');
      const nextResponse = await axios.get(nextUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      allTracks = allTracks.concat(nextResponse.data.items);
      nextUrl = nextResponse.data.next;
    }

    // Convert to our format
    const songs = allTracks
      .filter(item => item.track && item.track.name) // Filter out null tracks
      .map(item => ({
        title: item.track.name,
        artist: item.track.artists.map(artist => artist.name).join(', '),
        album: item.track.album?.name || 'Unknown Album',
        duration: Math.round(item.track.duration_ms / 1000),
      }));

    console.log(`✅ Parsed Spotify playlist: "${playlist.name}" with ${songs.length} songs`);

    return {
      title: playlist.name,
      description: playlist.description || '',
      platform: 'spotify',
      originalUrl: url,
      songs: songs,
      totalDuration: songs.reduce((total, song) => total + (song.duration || 0), 0),
    };
  } catch (error) {
    console.error('❌ Spotify API error details:');
    console.error('HTTP Status Code:', error.response?.status);
    console.error('HTTP Status Text:', error.response?.statusText);
    console.error('Response Headers:', error.response?.headers);
    console.error('Response Data:', JSON.stringify(error.response?.data, null, 2));
    console.error('Request Config:', {
      url: error.config?.url,
      method: error.config?.method,
      headers: error.config?.headers
    });
    console.error('Error Message:', error.message);
    
    const playlistId = extractSpotifyPlaylistId(url);
    console.error('❌ Playlist ID that failed:', playlistId);
    console.error('❌ Full URL that failed:', url);
    
    if (error.response?.status === 404) {
      throw new Error(`Spotify playlist not found (HTTP 404). This could mean:
• The playlist is private or deleted
• The URL is incorrect or malformed
• The playlist ID "${playlistId}" doesn't exist
• You don't have permission to access this playlist

Please ensure:
1. The playlist is public
2. The URL is correct and complete
3. Try copying the URL directly from Spotify

Example of a valid URL: https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M`);
    } else if (error.response?.status === 401) {
      throw new Error('Spotify authentication failed (HTTP 401). Please check your API credentials in the .env file and restart the server.');
    } else if (error.response?.status === 403) {
      throw new Error('Access forbidden (HTTP 403). Your Spotify API credentials may not have the required permissions.');
    } else if (error.response?.status === 429) {
      throw new Error('Spotify API rate limit exceeded (HTTP 429). Please wait a moment and try again.');
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      throw new Error('Network error: Unable to connect to Spotify API. Please check your internet connection.');
    } else {
      throw new Error(`Failed to parse Spotify playlist: ${error.message} (HTTP ${error.response?.status || 'Unknown'})`);
    }
  }
}

/**
 * Search for songs on Spotify
 */
export async function searchSpotifyTracks(songs) {
  try {
    const token = await getSpotifyToken();
    const matches = [];

    for (const song of songs) {
      try {
        const query = `track:"${song.title}" artist:"${song.artist}"`;
        
        const response = await axios.get(
          'https://api.spotify.com/v1/search',
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            params: {
              q: query,
              type: 'track',
              limit: 5,
            },
          }
        );

        const tracks = response.data.tracks.items;
        
        if (tracks.length > 0) {
          const bestMatch = tracks[0]; // Spotify's search is quite good
          matches.push({
            originalSong: song,
            matchedSong: {
              title: bestMatch.name,
              artist: bestMatch.artists.map(a => a.name).join(', '),
              album: bestMatch.album.name,
              duration: Math.round(bestMatch.duration_ms / 1000),
              spotifyUrl: bestMatch.external_urls.spotify,
            },
            status: 'matched',
            confidence: 0.95, // Spotify search is generally very accurate
          });
        } else {
          matches.push({
            originalSong: song,
            status: 'not_found',
          });
        }

        // Rate limiting - be nice to Spotify's API
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Failed to search for "${song.title}":`, error.message);
        matches.push({
          originalSong: song,
          status: 'not_found',
        });
      }
    }

    return matches;
  } catch (error) {
    console.error('❌ Spotify search error:', error.message);
    throw new Error('Failed to search Spotify tracks');
  }
}

function extractSpotifyPlaylistId(url) {
  // Handle various Spotify URL formats
  const patterns = [
    /spotify\.com\/playlist\/([a-zA-Z0-9]+)/,  // Standard web URL
    /open\.spotify\.com\/playlist\/([a-zA-Z0-9]+)/, // Open Spotify URL
    /spotify:playlist:([a-zA-Z0-9]+)/, // Spotify URI
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return null;
}