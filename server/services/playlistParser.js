import { parseSpotifyPlaylist } from './spotifyApi.js';
import { parseYouTubePlaylist } from './youtubeApi.js';
import { parseSoundCloudPlaylist } from './soundcloudApi.js';

/**
 * Parse playlist from various platforms using real APIs
 */
export async function parsePlaylist(url) {
  const platform = detectPlatform(url);
  
  console.log(`🎵 Parsing ${platform} playlist: ${url}`);
  
  switch (platform) {
    case 'spotify':
      return await parseSpotifyPlaylist(url);
    case 'youtube':
      return await parseYouTubePlaylist(url);
    case 'soundcloud':
      return await parseSoundCloudPlaylist(url);
    case 'apple':
      return parseAppleMusicPlaylist(url); // Still mock for now
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

function detectPlatform(url) {
  if (url.includes('spotify.com')) return 'spotify';
  if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('music.youtube.com')) return 'youtube';
  if (url.includes('soundcloud.com')) return 'soundcloud';
  if (url.includes('music.apple.com')) return 'apple';
  throw new Error('Unable to detect platform from URL');
}

// Keep Apple Music as mock for now (their API is more restrictive)
async function parseAppleMusicPlaylist(url) {
  console.log('⚠️  Apple Music parsing is still in demo mode');
  
  return {
    title: "Apple Music Hits",
    description: "Popular songs from Apple Music",
    platform: "apple",
    originalUrl: url,
    songs: [
      { title: "As It Was", artist: "Harry Styles", album: "Harry's House" },
      { title: "Anti-Hero", artist: "Taylor Swift", album: "Midnights" },
      { title: "Flowers", artist: "Miley Cyrus", album: "Endless Summer Vacation" },
    ],
    totalDuration: 900
  };
}