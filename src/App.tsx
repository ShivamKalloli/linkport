import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ConversionForm from './components/ConversionForm';
import ConversionProgress from './components/ConversionProgress';
import ConversionResults from './components/ConversionResults';
import Footer from './components/Footer';
import { ConversionState } from './types';

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
      // Call the backend API
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sourceUrl, targetPlatform }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Conversion failed');
      }

      const data = await response.json();
      
      setConversionState({
        ...conversionState,
        status: 'completed',
        results: data,
      });
    } catch (error) {
      console.error('Conversion error:', error);
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