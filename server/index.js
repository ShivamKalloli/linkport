import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { parsePlaylist } from './services/playlistParser.js';
import { matchSongs } from './services/songMatcher.js';
import { createMirrorPlaylist } from './services/playlistCreator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

console.log('🚀 LinkPort server starting...');
console.log('⚠️  Running in demo mode with mock data');

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// API Routes
app.post('/api/convert', async (req, res) => {
  try {
    const { sourceUrl, targetPlatform } = req.body;

    console.log('🎵 Conversion request:', { sourceUrl, targetPlatform });

    if (!sourceUrl || !targetPlatform) {
      return res.status(400).json({ 
        error: 'Missing required parameters',
        details: 'Both sourceUrl and targetPlatform are required'
      });
    }

    // Validate URL format
    try {
      new URL(sourceUrl);
    } catch (urlError) {
      return res.status(400).json({
        error: 'Invalid URL format',
        details: 'Please provide a valid playlist URL'
      });
    }

    // Step 1: Parse the source playlist
    console.log('📋 Step 1: Parsing playlist from:', sourceUrl);
    const sourcePlaylist = await parsePlaylist(sourceUrl);
    console.log(`✅ Parsed playlist: "${sourcePlaylist.title}" with ${sourcePlaylist.songs.length} songs`);

    // Step 2: Match songs on target platform
    console.log('🔍 Step 2: Matching songs for platform:', targetPlatform);
    const matches = await matchSongs(sourcePlaylist.songs, targetPlatform);
    console.log(`✅ Matched ${matches.length} songs`);

    // Step 3: Create mirror playlist
    console.log('🎼 Step 3: Creating mirror playlist');
    const mirrorPlaylist = await createMirrorPlaylist(
      sourcePlaylist,
      matches,
      targetPlatform
    );

    // Step 4: Generate response
    const stats = {
      totalSongs: matches.length,
      matchedSongs: matches.filter(m => m.status === 'matched').length,
      partialMatches: matches.filter(m => m.status === 'partial').length,
      notFound: matches.filter(m => m.status === 'not_found').length,
    };

    const results = {
      sourcePlaylist,
      targetPlaylist: mirrorPlaylist,
      matches,
      shareableUrl: mirrorPlaylist.shareableUrl,
      qrCode: mirrorPlaylist.qrCode,
      stats,
    };

    console.log('🎉 Conversion completed successfully');
    res.json(results);
  } catch (error) {
    console.error('❌ Conversion error:', error);
    res.status(500).json({ 
      error: 'Failed to convert playlist',
      details: error.message 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'LinkPort API is running in demo mode',
    mode: 'demo'
  });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    configured: 0,
    total: 4,
    platforms: {
      spotify: false,
      youtube: false,
      soundcloud: false,
      apple: false
    },
    mode: 'demo',
    message: 'Running in demo mode with mock data'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'LinkPort API is working!',
    mode: 'Demo Mode - Mock Data',
    endpoints: [
      'POST /api/convert - Convert playlist',
      'GET /api/health - Health check',
      'GET /api/status - API configuration status',
      'GET /api/test - This endpoint'
    ]
  });
});

// Serve React app for all other routes (in production)
app.get('*', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  } else {
    res.json({ message: 'LinkPort API - Development Mode' });
  }
});

app.listen(PORT, () => {
  console.log('');
  console.log('🚀 LinkPort server running on port', PORT);
  console.log('📡 API available at http://localhost:' + PORT + '/api');
  console.log('🔍 Health check: http://localhost:' + PORT + '/api/health');
  console.log('📊 API status: http://localhost:' + PORT + '/api/status');
  console.log('🧪 Test endpoint: http://localhost:' + PORT + '/api/test');
  console.log('');
  console.log('⚠️  Demo mode - using mock data for all conversions');
  console.log('');
});