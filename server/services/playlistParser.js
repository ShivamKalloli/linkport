import axios from 'axios';
import { parse } from 'node-html-parser';

/**
 * Parse playlist from various platforms
 */
export async function parsePlaylist(url) {
  const platform = detectPlatform(url);
  
  switch (platform) {
    case 'spotify':
      return parseSpotifyPlaylist(url);
    case 'youtube':
      return parseYouTubePlaylist(url);
    case 'soundcloud':
      return parseSoundCloudPlaylist(url);
    case 'apple':
      return parseAppleMusicPlaylist(url);
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

async function parseSpotifyPlaylist(url) {
  try {
    console.log('Parsing Spotify playlist:', url);
    
    // Extract playlist ID from URL
    const playlistId = extractSpotifyPlaylistId(url);
    if (!playlistId) {
      throw new Error('Invalid Spotify playlist URL');
    }

    // For demo purposes, we'll return mock data based on the URL
    // In production, you'd implement actual Spotify Web API integration
    const mockPlaylists = {
      'default': {
        title: "My Awesome Playlist",
        description: "A great collection of songs",
        platform: "spotify",
        originalUrl: url,
        songs: [
          { title: "Bohemian Rhapsody", artist: "Queen", album: "A Night at the Opera" },
          { title: "Stairway to Heaven", artist: "Led Zeppelin", album: "Led Zeppelin IV" },
          { title: "Imagine", artist: "John Lennon", album: "Imagine" },
          { title: "Sweet Child O' Mine", artist: "Guns N' Roses", album: "Appetite for Destruction" },
          { title: "Hotel California", artist: "Eagles", album: "Hotel California" },
          { title: "Smells Like Teen Spirit", artist: "Nirvana", album: "Nevermind" },
          { title: "Billie Jean", artist: "Michael Jackson", album: "Thriller" },
          { title: "Like a Rolling Stone", artist: "Bob Dylan", album: "Highway 61 Revisited" },
        ],
        totalDuration: 2400
      }
    };

    return mockPlaylists.default;
  } catch (error) {
    console.error('Error parsing Spotify playlist:', error);
    throw new Error('Failed to parse Spotify playlist. Make sure the playlist is public or unlisted.');
  }
}

async function parseYouTubePlaylist(url) {
  try {
    console.log('Parsing YouTube playlist:', url);
    
    const playlistId = extractYouTubePlaylistId(url);
    if (!playlistId) {
      throw new Error('Invalid YouTube playlist URL');
    }

    // Mock implementation for demo
    return {
      title: "YouTube Music Mix",
      description: "Great songs from YouTube",
      platform: "youtube",
      originalUrl: url,
      songs: [
        { title: "Dancing Queen", artist: "ABBA", album: "Arrival" },
        { title: "Don't Stop Believin'", artist: "Journey", album: "Escape" },
        { title: "Billie Jean", artist: "Michael Jackson", album: "Thriller" },
        { title: "Bohemian Rhapsody", artist: "Queen", album: "A Night at the Opera" },
        { title: "Sweet Caroline", artist: "Neil Diamond", album: "Brother Love's Travelling Salvation Show" },
      ],
      totalDuration: 1800
    };
  } catch (error) {
    console.error('Error parsing YouTube playlist:', error);
    throw new Error('Failed to parse YouTube playlist. Make sure the playlist is public or unlisted.');
  }
}

async function parseSoundCloudPlaylist(url) {
  try {
    console.log('Parsing SoundCloud playlist:', url);
    
    // Mock implementation for demo
    return {
      title: "SoundCloud Indie Mix",
      description: "Independent music collection",
      platform: "soundcloud",
      originalUrl: url,
      songs: [
        { title: "Midnight City", artist: "M83", album: "Hurry Up, We're Dreaming" },
        { title: "Pumped Up Kicks", artist: "Foster the People", album: "Torches" },
        { title: "Electric Feel", artist: "MGMT", album: "Oracular Spectacular" },
        { title: "Take Me Out", artist: "Franz Ferdinand", album: "Franz Ferdinand" },
      ],
      totalDuration: 1200
    };
  } catch (error) {
    console.error('Error parsing SoundCloud playlist:', error);
    throw new Error('Failed to parse SoundCloud playlist. Make sure the playlist is public.');
  }
}

async function parseAppleMusicPlaylist(url) {
  try {
    console.log('Parsing Apple Music playlist:', url);
    
    // Apple Music is more restrictive, but we can try
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
  } catch (error) {
    console.error('Error parsing Apple Music playlist:', error);
    throw new Error('Failed to parse Apple Music playlist. Apple Music playlists have limited public access.');
  }
}

function extractSpotifyPlaylistId(url) {
  const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

function extractYouTubePlaylistId(url) {
  const match = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}