import axios from 'axios';
import { apiKeys } from '../config/apiKeys.js';

let spotifyToken = null;
let tokenExpiry = null;

/**
 * Get Spotify access token using Client Credentials flow
 */
async function getSpotifyToken() {
  if (spotifyToken && tokenExpiry && Date.now() < tokenExpiry) {
    console.log('🔄 Using cached Spotify token');
    return spotifyToken;
  }

  try {
    console.log('🔑 Requesting new Spotify token...');
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

    console.log('✅ Spotify token obtained successfully');
    console.log('🕒 Token expires in:', Math.round((tokenExpiry - Date.now()) / 1000), 'seconds');
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
  console.log('🎵 Starting Spotify playlist parsing...');
  console.log('📝 Input URL:', url);
  
  try {
    // Step 1: Extract playlist ID
    console.log('🔍 Step 1: Extracting playlist ID from URL...');
    const playlistId = extractSpotifyPlaylistId(url);
    
    if (!playlistId) {
      console.error('❌ Failed to extract playlist ID from URL:', url);
      throw new Error('Invalid Spotify playlist URL format. Please use a valid Spotify playlist URL like: https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M');
    }

    console.log('✅ Extracted playlist ID:', playlistId);

    // Step 2: Get authentication token
    console.log('🔍 Step 2: Getting Spotify authentication token...');
    const token = await getSpotifyToken();
    console.log('✅ Token obtained, length:', token.length);
    
    // Step 3: Make API request
    console.log('🔍 Step 3: Making API request to Spotify...');
    const apiUrl = `https://api.spotify.com/v1/playlists/${playlistId}`;
    console.log('🔗 API URL:', apiUrl);
    
    const requestConfig = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      params: {
        fields: 'name,description,tracks.items(track(name,artists(name),album(name),duration_ms)),tracks.total,public',
      },
    };
    
    console.log('📋 Request headers:', requestConfig.headers);
    console.log('📋 Request params:', requestConfig.params);
    
    console.log('⏳ Sending request to Spotify API...');
    const playlistResponse = await axios.get(apiUrl, requestConfig);
    
    console.log('✅ Spotify API response received');
    console.log('📊 Response status:', playlistResponse.status);
    console.log('📊 Response headers:', playlistResponse.headers);

    const playlist = playlistResponse.data;
    console.log('📋 Playlist data received:');
    console.log('  - Name:', playlist.name);
    console.log('  - Total tracks:', playlist.tracks?.total);
    console.log('  - Is public:', playlist.public);
    console.log('  - Description:', playlist.description?.substring(0, 100) + '...');
    
    // Handle pagination for large playlists
    let allTracks = playlist.tracks.items;
    let nextUrl = playlist.tracks.next;
    
    console.log('📄 Initial tracks loaded:', allTracks.length);
    
    while (nextUrl && allTracks.length < 100) { // Limit to 100 songs for demo
      console.log('📄 Fetching additional tracks from:', nextUrl);
      const nextResponse = await axios.get(nextUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      allTracks = allTracks.concat(nextResponse.data.items);
      nextUrl = nextResponse.data.next;
      console.log('📄 Total tracks now:', allTracks.length);
    }

    // Convert to our format
    console.log('🔄 Converting tracks to internal format...');
    const songs = allTracks
      .filter(item => {
        if (!item.track || !item.track.name) {
          console.log('⚠️ Skipping null/invalid track:', item);
          return false;
        }
        return true;
      })
      .map((item, index) => {
        const song = {
          title: item.track.name,
          artist: item.track.artists.map(artist => artist.name).join(', '),
          album: item.track.album?.name || 'Unknown Album',
          duration: Math.round(item.track.duration_ms / 1000),
        };
        
        if (index < 3) { // Log first 3 songs for debugging
          console.log(`🎵 Song ${index + 1}:`, song);
        }
        
        return song;
      });

    console.log(`✅ Successfully parsed Spotify playlist: "${playlist.name}" with ${songs.length} songs`);

    const result = {
      title: playlist.name,
      description: playlist.description || '',
      platform: 'spotify',
      originalUrl: url,
      songs: songs,
      totalDuration: songs.reduce((total, song) => total + (song.duration || 0), 0),
    };
    
    console.log('📦 Final result object created');
    return result;
    
  } catch (error) {
    console.error('❌ ERROR OCCURRED IN parseSpotifyPlaylist:');
    console.error('❌ Error type:', error.constructor.name);
    console.error('❌ Error message:', error.message);
    
    if (error.response) {
      console.error('❌ HTTP Response Error Details:');
      console.error('  - Status Code:', error.response.status);
      console.error('  - Status Text:', error.response.statusText);
      console.error('  - Response Headers:', JSON.stringify(error.response.headers, null, 2));
      console.error('  - Response Data:', JSON.stringify(error.response.data, null, 2));
    }
    
    if (error.request) {
      console.error('❌ HTTP Request Details:');
      console.error('  - Request URL:', error.config?.url);
      console.error('  - Request Method:', error.config?.method);
      console.error('  - Request Headers:', JSON.stringify(error.config?.headers, null, 2));
    }
    
    console.error('❌ Full error object:', error);
    
    const playlistId = extractSpotifyPlaylistId(url);
    console.error('❌ Failed playlist ID:', playlistId);
    console.error('❌ Failed URL:', url);
    
    // Provide specific error messages based on the error type
    if (error.response?.status === 404) {
      const errorMsg = `Spotify playlist not found (HTTP 404).

Playlist ID: ${playlistId}
URL: ${url}

This could mean:
• The playlist is private or deleted
• The URL is incorrect or malformed  
• The playlist ID "${playlistId}" doesn't exist
• You don't have permission to access this playlist

Please ensure:
1. The playlist is PUBLIC (not private)
2. The URL is correct and complete
3. Try copying the URL directly from Spotify
4. Test with a known public playlist

Example of a valid URL: https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M`;
      
      console.error('❌ Detailed 404 error explanation:', errorMsg);
      throw new Error(errorMsg);
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
  console.log('🔍 Extracting playlist ID from URL:', url);
  
  // Clean the URL first - remove any trailing parameters after the playlist ID
  let cleanUrl = url.trim();
  
  // Handle various Spotify URL formats with more comprehensive patterns
  const patterns = [
    // Standard web URLs
    /(?:https?:\/\/)?(?:open\.)?spotify\.com\/playlist\/([a-zA-Z0-9]+)/i,
    // Spotify URIs
    /spotify:playlist:([a-zA-Z0-9]+)/i,
    // Mobile share URLs
    /(?:https?:\/\/)?spotify\.link\/([a-zA-Z0-9]+)/i,
    // Any URL containing playlist ID pattern
    /playlist[\/:]([a-zA-Z0-9]+)/i,
  ];
  
  for (let i = 0; i < patterns.length; i++) {
    const pattern = patterns[i];
    console.log(`🔍 Trying pattern ${i + 1}:`, pattern.toString());
    const match = cleanUrl.match(pattern);
    if (match && match[1]) {
      console.log('✅ Pattern matched! Extracted ID:', match[1]);
      
      // Validate the extracted ID (Spotify playlist IDs are typically 22 characters)
      const playlistId = match[1];
      if (playlistId.length >= 10 && playlistId.length <= 30) {
        console.log('✅ Playlist ID validation passed:', playlistId);
        return playlistId;
      } else {
        console.log('⚠️ Playlist ID failed validation (length):', playlistId);
      }
    }
  }
  
  // Try to extract any alphanumeric string that could be a playlist ID
  console.log('🔍 Attempting fallback extraction...');
  const fallbackMatch = cleanUrl.match(/([a-zA-Z0-9]{15,25})/);
  if (fallbackMatch) {
    console.log('✅ Fallback extraction found:', fallbackMatch[1]);
    return fallbackMatch[1];
  }
  
  console.log('❌ No pattern matched for URL:', url);
  console.log('❌ Cleaned URL was:', cleanUrl);
  return null;
}