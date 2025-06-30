import axios from 'axios';
import { apiKeys } from '../config/apiKeys.js';

/**
 * Parse YouTube Music playlist using real API
 */
export async function parseYouTubePlaylist(url) {
  try {
    const playlistId = extractYouTubePlaylistId(url);
    if (!playlistId) {
      throw new Error('Invalid YouTube playlist URL');
    }

    // Get playlist details
    const playlistResponse = await axios.get(
      'https://www.googleapis.com/youtube/v3/playlists',
      {
        params: {
          key: apiKeys.youtube.apiKey,
          id: playlistId,
          part: 'snippet',
        },
      }
    );

    if (!playlistResponse.data.items || playlistResponse.data.items.length === 0) {
      throw new Error('Playlist not found or is private');
    }

    const playlist = playlistResponse.data.items[0];

    // Get playlist items
    const itemsResponse = await axios.get(
      'https://www.googleapis.com/youtube/v3/playlistItems',
      {
        params: {
          key: apiKeys.youtube.apiKey,
          playlistId: playlistId,
          part: 'snippet',
          maxResults: 50, // YouTube API limit
        },
      }
    );

    // Convert to our format
    const songs = itemsResponse.data.items
      .filter(item => item.snippet.title !== 'Private video' && item.snippet.title !== 'Deleted video')
      .map(item => {
        const title = item.snippet.title;
        
        // Try to extract artist from title (common YouTube format: "Artist - Song Title")
        const parts = title.split(' - ');
        let artist = 'Unknown Artist';
        let songTitle = title;
        
        if (parts.length >= 2) {
          artist = parts[0].trim();
          songTitle = parts.slice(1).join(' - ').trim();
        }

        return {
          title: songTitle,
          artist: artist,
          album: 'YouTube',
          youtubeUrl: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
        };
      });

    console.log(`✅ Parsed YouTube playlist: "${playlist.snippet.title}" with ${songs.length} songs`);

    return {
      title: playlist.snippet.title,
      description: playlist.snippet.description || '',
      platform: 'youtube',
      originalUrl: url,
      songs: songs,
      totalDuration: songs.length * 210, // Estimate 3.5 minutes per song
    };
  } catch (error) {
    console.error('❌ YouTube API error:', error.response?.data || error.message);
    
    if (error.response?.status === 403) {
      throw new Error('YouTube API quota exceeded or invalid API key');
    } else if (error.response?.status === 404) {
      throw new Error('Playlist not found or is private');
    } else {
      throw new Error(`Failed to parse YouTube playlist: ${error.message}`);
    }
  }
}

/**
 * Search for songs on YouTube
 */
export async function searchYouTubeTracks(songs) {
  try {
    const matches = [];

    for (const song of songs) {
      try {
        const query = `${song.artist} ${song.title}`;
        
        const response = await axios.get(
          'https://www.googleapis.com/youtube/v3/search',
          {
            params: {
              key: apiKeys.youtube.apiKey,
              q: query,
              part: 'snippet',
              type: 'video',
              videoCategoryId: '10', // Music category
              maxResults: 5,
            },
          }
        );

        const videos = response.data.items;
        
        if (videos.length > 0) {
          const bestMatch = videos[0];
          
          // Try to extract artist and title from YouTube title
          const title = bestMatch.snippet.title;
          const parts = title.split(' - ');
          let artist = bestMatch.snippet.channelTitle;
          let songTitle = title;
          
          if (parts.length >= 2) {
            artist = parts[0].trim();
            songTitle = parts.slice(1).join(' - ').trim();
          }

          matches.push({
            originalSong: song,
            matchedSong: {
              title: songTitle,
              artist: artist,
              album: 'YouTube',
              youtubeUrl: `https://www.youtube.com/watch?v=${bestMatch.id.videoId}`,
            },
            status: 'matched',
            confidence: 0.85, // YouTube search can be less precise
          });
        } else {
          matches.push({
            originalSong: song,
            status: 'not_found',
          });
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
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
    console.error('❌ YouTube search error:', error.message);
    throw new Error('Failed to search YouTube tracks');
  }
}

function extractYouTubePlaylistId(url) {
  const match = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}