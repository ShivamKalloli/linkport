import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const apiKeys = {
  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  },
  youtube: {
    apiKey: process.env.YOUTUBE_API_KEY,
  },
  soundcloud: {
    clientId: process.env.SOUNDCLOUD_CLIENT_ID,
  },
};

// Validate required API keys
export const validateApiKeys = () => {
  const missing = [];
  
  if (!apiKeys.spotify.clientId || !apiKeys.spotify.clientSecret) {
    missing.push('Spotify API credentials');
  }
  
  if (!apiKeys.youtube.apiKey) {
    missing.push('YouTube API key');
  }
  
  if (!apiKeys.soundcloud.clientId) {
    missing.push('SoundCloud API key');
  }
  
  if (missing.length > 0) {
    console.warn('⚠️  Missing API keys for:', missing.join(', '));
    console.warn('⚠️  Some features may not work properly');
    return false;
  }
  
  console.log('✅ All API keys configured');
  return true;
};