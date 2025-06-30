# 🔑 LinkPort API Setup Guide

This guide will help you set up real API integrations for LinkPort to work with actual streaming platforms.

## 📋 Prerequisites

You'll need to create developer accounts and get API keys from:
- **Spotify** (Required for Spotify playlists)
- **YouTube** (Required for YouTube Music playlists)  
- **SoundCloud** (Required for SoundCloud playlists)

## 🚀 Quick Setup

### 1. Copy Environment File
```bash
cp .env.example .env
```

### 2. Get Your API Keys

#### 🎵 Spotify API
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click "Create App"
3. Fill in app details:
   - **App Name**: LinkPort
   - **App Description**: Playlist converter
   - **Redirect URI**: `http://localhost:3001/callback` (not used but required)
4. Copy your **Client ID** and **Client Secret**

#### 🎬 YouTube Data API
1. Go to [Google Cloud Console](https://console.developers.google.com)
2. Create a new project or select existing one
3. Enable "YouTube Data API v3"
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy your **API Key**

#### ☁️ SoundCloud API
1. Go to [SoundCloud Developers](https://developers.soundcloud.com)
2. Register your application
3. Copy your **Client ID**

### 3. Configure Environment Variables

Edit your `.env` file:

```env
# Spotify API
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here

# YouTube Data API v3
YOUTUBE_API_KEY=your_youtube_api_key_here

# SoundCloud API
SOUNDCLOUD_CLIENT_ID=your_soundcloud_client_id_here

# Environment
NODE_ENV=development
PORT=3001
```

### 4. Restart the Server

```bash
npm run start
```

You should see:
```
✅ All API keys configured
✅ Real API integration active!
```

## 🔍 Testing Your Setup

### Check API Status
Visit: `http://localhost:3001/api/status`

You should see:
```json
{
  "configured": 3,
  "total": 3,
  "platforms": {
    "spotify": true,
    "youtube": true,
    "soundcloud": true
  },
  "mode": "api"
}
```

### Test with Real Playlists

Try these real playlist URLs:

**Spotify:**
```
https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M
```

**YouTube Music:**
```
https://music.youtube.com/playlist?list=PLrAl6rYgs4IvGFBDEaVGFXt6k2GiOFWjS
```

**SoundCloud:**
```
https://soundcloud.com/discover/sets/weekly
```

## ⚠️ Important Notes

### API Limits & Quotas
- **Spotify**: 100 requests per minute
- **YouTube**: 10,000 units per day (default)
- **SoundCloud**: 15,000 requests per day

### Rate Limiting
LinkPort includes built-in rate limiting to respect API quotas:
- Spotify: 100ms delay between requests
- YouTube: 200ms delay between requests  
- SoundCloud: 300ms delay between requests

### Playlist Limitations
- **Spotify**: Public and unlisted playlists only
- **YouTube**: Public playlists only
- **SoundCloud**: Public playlists only
- **Apple Music**: Not yet supported (API restrictions)

## 🛠 Troubleshooting

### "Authentication failed" errors
- Double-check your API keys in `.env`
- Make sure there are no extra spaces or quotes
- Restart the server after changing `.env`

### "Quota exceeded" errors
- You've hit the daily API limit
- Wait 24 hours or upgrade your API plan
- Check the API status endpoint for details

### "Playlist not found" errors
- Make sure the playlist is public
- Check the URL format is correct
- Some playlists may be region-restricted

## 🔄 Fallback Behavior

If API keys are missing or invalid, LinkPort automatically falls back to demo mode with realistic mock data. This ensures the app always works, even without API configuration.

## 📊 Monitoring

Check your API usage:
- **Spotify**: [Developer Dashboard](https://developer.spotify.com/dashboard)
- **YouTube**: [Google Cloud Console](https://console.cloud.google.com/apis/dashboard)
- **SoundCloud**: [Developer Portal](https://developers.soundcloud.com/docs/api/guide)

## 🚀 Production Deployment

For production deployment:

1. Set environment variables in your hosting platform
2. Use production API keys (not development keys)
3. Consider implementing Redis for caching to reduce API calls
4. Monitor API usage and set up alerts for quota limits

---

**Need help?** Open an issue on [GitHub](https://github.com/ShivamKalloli/linkport/issues) or contact support.