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
    console.error('❌ Failed to get Spotify token:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with Spotify');
  }
}

/**
 * Parse Spotify playlist using real API
 */
export async function parseSpotifyPlaylist(url) {
  try {
    const playlistId = extractSpotifyPlaylistId(url);
    if (!playlistId) {
      throw new Error('Invalid Spotify playlist URL');
    }

    const token = await getSpotifyToken();
    
    // Get playlist details
    const playlistResponse = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: {
          fields: 'name,description,tracks.items(track(name,artists(name),album(name),duration_ms)),tracks.total',
        },
      }
    );

    const playlist = playlistResponse.data;
    
    // Handle pagination for large playlists
    let allTracks = playlist.tracks.items;
    let nextUrl = playlist.tracks.next;
    
    while (nextUrl && allTracks.length < 100) { // Limit to 100 songs for demo
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
    console.error('❌ Spotify API error:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      throw new Error('Playlist not found. Make sure the playlist is public or the URL is correct.');
    } else if (error.response?.status === 401) {
      throw new Error('Spotify authentication failed. Please check your API credentials.');
    } else {
      throw new Error(`Failed to parse Spotify playlist: ${error.message}`);
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
  const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}