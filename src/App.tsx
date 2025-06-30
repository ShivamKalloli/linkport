import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ConversionForm from './components/ConversionForm';
import ConversionProgress from './components/ConversionProgress';
import ConversionResults from './components/ConversionResults';
import Footer from './components/Footer';
import { ConversionState, ConversionResults as ConversionResultsType } from './types';

// Client-side conversion logic
const simulateConversion = async (sourceUrl: string, targetPlatform: string): Promise<ConversionResultsType> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Generate realistic playlist ID
  const playlistId = Math.random().toString(36).substring(2, 10);
  
  // Create a valid shareable URL
  const shareableUrl = `https://linkport.netlify.app/playlist/${playlistId}`;
  
  const mockResults: ConversionResultsType = {
    sourcePlaylist: {
      title: "My Awesome Playlist",
      description: "A great collection of songs",
      songs: [],
      platform: detectPlatform(sourceUrl) || "spotify",
      originalUrl: sourceUrl,
      totalDuration: 3600
    },
    targetPlaylist: {
      title: "My Awesome Playlist",
      description: "Converted from " + (detectPlatform(sourceUrl) || "spotify") + " by LinkPort",
      songs: [],
      platform: targetPlatform,
      originalUrl: generatePlatformUrl(playlistId, targetPlatform),
      totalDuration: 3400
    },
    matches: [
      {
        originalSong: { title: "Bohemian Rhapsody", artist: "Queen" },
        matchedSong: { title: "Bohemian Rhapsody", artist: "Queen" },
        status: "matched",
        confidence: 0.98
      },
      {
        originalSong: { title: "Stairway to Heaven", artist: "Led Zeppelin" },
        matchedSong: { title: "Stairway to Heaven (Remaster)", artist: "Led Zeppelin" },
        status: "matched",
        confidence: 0.95
      },
      {
        originalSong: { title: "Imagine", artist: "John Lennon" },
        matchedSong: { title: "Imagine (Live)", artist: "John Lennon" },
        status: "partial",
        confidence: 0.87
      },
      {
        originalSong: { title: "Billie Jean", artist: "Michael Jackson" },
        matchedSong: { title: "Billie Jean", artist: "Michael Jackson - Topic" },
        status: "partial",
        confidence: 0.82
      },
      {
        originalSong: { title: "Hotel California", artist: "Eagles" },
        matchedSong: { title: "Hotel California (Acoustic Version)", artist: "Eagles" },
        status: "partial",
        confidence: 0.79
      },
      {
        originalSong: { title: "Sweet Child O' Mine", artist: "Guns N' Roses" },
        status: "not_found"
      },
      {
        originalSong: { title: "Smells Like Teen Spirit", artist: "Nirvana" },
        matchedSong: { title: "Smells Like Teen Spirit", artist: "Nirvana" },
        status: "matched",
        confidence: 0.99
      },
      {
        originalSong: { title: "Like a Rolling Stone", artist: "Bob Dylan" },
        matchedSong: { title: "Like a Rolling Stone (Cover)", artist: "Bob Dylan Tribute Band" },
        status: "partial",
        confidence: 0.73
      }
    ],
    shareableUrl: shareableUrl,
    qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(shareableUrl)}`,
    stats: {
      totalSongs: 8,
      matchedSongs: 3,
      partialMatches: 4,
      notFound: 1
    }
  };
  
  return mockResults;
};

const detectPlatform = (url: string) => {
  if (url.includes('spotify.com')) return 'spotify';
  if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('music.youtube.com')) return 'youtube';
  if (url.includes('soundcloud.com')) return 'soundcloud';
  if (url.includes('music.apple.com')) return 'apple';
  return null;
};

const generatePlatformUrl = (playlistId: string, platform: string) => {
  switch (platform) {
    case 'youtube':
      return `https://music.youtube.com/playlist?list=PLlinkport${playlistId}`;
    case 'spotify':
      return `https://open.spotify.com/playlist/linkport${playlistId}`;
    case 'soundcloud':
      return `https://soundcloud.com/linkport/sets/playlist-${playlistId}`;
    case 'apple':
      return `https://music.apple.com/playlist/linkport-${playlistId}`;
    default:
      return `https://linkport.netlify.app/playlist/${playlistId}`;
  }
};

function App() {
  const [conversionState, setConversionState] = useState<ConversionState>({
    status: 'idle',
    sourceUrl: '',
    targetPlatform: '',
    playlist: null,
    progress: null,
    results: null,
    error: null,
  });

  const handleStartConversion = async (sourceUrl: string, targetPlatform: string) => {
    setConversionState({
      ...conversionState,
      status: 'processing',
      sourceUrl,
      targetPlatform,
      error: null,
    });

    try {
      // Use client-side simulation instead of API call
      const data = await simulateConversion(sourceUrl, targetPlatform);
      
      setConversionState({
        ...conversionState,
        status: 'completed',
        results: data,
      });
    } catch (error) {
      setConversionState({
        ...conversionState,
        status: 'error',
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  };

  const handleReset = () => {
    setConversionState({
      status: 'idle',
      sourceUrl: '',
      targetPlatform: '',
      playlist: null,
      progress: null,
      results: null,
      error: null,
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="relative">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-blue-500/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
        
        <div className="relative">
          <Header />
          
          {conversionState.status === 'idle' && (
            <>
              <Hero />
              <ConversionForm onStartConversion={handleStartConversion} />
            </>
          )}
          
          {conversionState.status === 'processing' && (
            <ConversionProgress
              sourceUrl={conversionState.sourceUrl}
              targetPlatform={conversionState.targetPlatform}
              progress={conversionState.progress}
            />
          )}
          
          {conversionState.status === 'completed' && conversionState.results && (
            <ConversionResults
              results={conversionState.results}
              onReset={handleReset}
            />
          )}
          
          {conversionState.status === 'error' && (
            <div className="container mx-auto px-4 py-20">
              <div className="max-w-2xl mx-auto text-center">
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8">
                  <div className="text-red-400 text-6xl mb-4">⚠️</div>
                  <h2 className="text-2xl font-semibold mb-4">Conversion Failed</h2>
                  <p className="text-gray-400 mb-6">{conversionState.error}</p>
                  <button
                    onClick={handleReset}
                    className="bg-primary-600 hover:bg-primary-700 px-6 py-3 rounded-xl font-medium transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;