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
};

// Validate required API keys
export const validateApiKeys = () => {
  const configured = [];
  const missing = [];
  
  if (apiKeys.spotify.clientId && apiKeys.spotify.clientSecret) {
    configured.push('Spotify API');
  } else {
    missing.push('Spotify API credentials');
  }
  
  if (apiKeys.youtube.apiKey) {
    configured.push('YouTube API');
  } else {
    missing.push('YouTube API key');
  }
  
  if (configured.length > 0) {
    console.log('✅ Configured APIs:', configured.join(', '));
  }
  
  if (missing.length > 0) {
    console.warn('⚠️  Missing API keys for:', missing.join(', '));
    console.warn('⚠️  Running in demo mode for missing APIs');
  }
  
  return configured.length > 0;
};