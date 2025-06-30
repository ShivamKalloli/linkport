import axios from 'axios';
import { apiKeys } from '../config/apiKeys.js';

/**
 * Parse SoundCloud playlist using real API
 */
export async function parseSoundCloudPlaylist(url) {
  try {
    // SoundCloud API requires resolving the URL first
    const resolveResponse = await axios.get(
      'https://api.soundcloud.com/resolve',
      {
        params: {
          url: url,
          client_id: apiKeys.soundcloud.clientId,
        },
      }
    );

    const playlist = resolveResponse.data;

    if (playlist.kind !== 'playlist') {
      throw new Error('URL does not point to a SoundCloud playlist');
    }

    // Convert tracks to our format
    const songs = playlist.tracks.map(track => ({
      title: track.title,
      artist: track.user.username,
      album: 'SoundCloud',
      duration: Math.round(track.duration / 1000),
      soundcloudUrl: track.permalink_url,
    }));

    console.log(`✅ Parsed SoundCloud playlist: "${playlist.title}" with ${songs.length} songs`);

    return {
      title: playlist.title,
      description: playlist.description || '',
      platform: 'soundcloud',
      originalUrl: url,
      songs: songs,
      totalDuration: songs.reduce((total, song) => total + (song.duration || 0), 0),
    };
  } catch (error) {
    console.error('❌ SoundCloud API error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      throw new Error('SoundCloud API authentication failed');
    } else if (error.response?.status === 404) {
      throw new Error('Playlist not found or is private');
    } else {
      throw new Error(`Failed to parse SoundCloud playlist: ${error.message}`);
    }
  }
}

/**
 * Search for songs on SoundCloud
 */
export async function searchSoundCloudTracks(songs) {
  try {
    const matches = [];

    for (const song of songs) {
      try {
        const query = `${song.artist} ${song.title}`;
        
        const response = await axios.get(
          'https://api.soundcloud.com/tracks',
          {
            params: {
              client_id: apiKeys.soundcloud.clientId,
              q: query,
              limit: 5,
            },
          }
        );

        const tracks = response.data;
        
        if (tracks.length > 0) {
          const bestMatch = tracks[0];
          
          matches.push({
            originalSong: song,
            matchedSong: {
              title: bestMatch.title,
              artist: bestMatch.user.username,
              album: 'SoundCloud',
              duration: Math.round(bestMatch.duration / 1000),
              soundcloudUrl: bestMatch.permalink_url,
            },
            status: 'matched',
            confidence: 0.80, // SoundCloud search can vary in quality
          });
        } else {
          matches.push({
            originalSong: song,
            status: 'not_found',
          });
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));
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
    console.error('❌ SoundCloud search error:', error.message);
    throw new Error('Failed to search SoundCloud tracks');
  }
}