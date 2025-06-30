import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ConversionForm from './components/ConversionForm';
import ConversionProgress from './components/ConversionProgress';
import ConversionResults from './components/ConversionResults';
import Footer from './components/Footer';
import { ConversionState } from './types';
import { mockConvertPlaylist } from './services/mockApi';

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
      // Always use mock API for consistent behavior across all deployments
      const data = await mockConvertPlaylist(sourceUrl, targetPlatform);
      
      setConversionState({
        ...conversionState,
        status: 'completed',
        results: data,
      });
    } catch (error) {
      console.error('Conversion error:', error);
      
      // Extract more meaningful error messages
      let errorMessage = 'An unknown error occurred';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      setConversionState({
        ...conversionState,
        status: 'error',
        error: errorMessage,
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
              <div className="max-w-4xl mx-auto text-center">
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8">
                  <div className="text-red-400 text-6xl mb-4">⚠️</div>
                  <h2 className="text-2xl font-semibold mb-4">Conversion Failed</h2>
                  <div className="text-gray-300 mb-6 text-left bg-gray-900/50 rounded-lg p-4 max-w-2xl mx-auto">
                    <pre className="whitespace-pre-wrap text-sm">{conversionState.error}</pre>
                  </div>
                  
                  {/* Helpful tips */}
                  <div className="text-left bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
                    <h3 className="text-lg font-semibold text-blue-400 mb-2">💡 Troubleshooting Tips:</h3>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Make sure the playlist URL is from a supported platform</li>
                      <li>• Copy the URL directly from the streaming platform</li>
                      <li>• Try with a different public playlist to test</li>
                      <li>• Check that the URL format is correct</li>
                      <li>• This demo uses mock data for demonstration purposes</li>
                    </ul>
                  </div>
                  
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