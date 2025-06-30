import React, { useState } from 'react';
import { Link, ArrowRight, Music, Copy } from 'lucide-react';
import { Platform, PlatformInfo } from '../types';

interface ConversionFormProps {
  onStartConversion: (sourceUrl: string, targetPlatform: string) => void;
}

const platforms: PlatformInfo[] = [
  {
    id: 'spotify',
    name: 'Spotify',
    icon: '🎵',
    color: 'bg-green-500',
    supportedAsSource: true,
    supportedAsTarget: true,
  },
  {
    id: 'youtube',
    name: 'YouTube Music',
    icon: '🎬',
    color: 'bg-red-500',
    supportedAsSource: true,
    supportedAsTarget: true,
  },
  {
    id: 'soundcloud',
    name: 'SoundCloud',
    icon: '☁️',
    color: 'bg-orange-500',
    supportedAsSource: true,
    supportedAsTarget: true,
  },
  {
    id: 'apple',
    name: 'Apple Music',
    icon: '🍎',
    color: 'bg-gray-600',
    supportedAsSource: true,
    supportedAsTarget: true,
  },
];

const sampleUrls = [
  'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M',
  'https://music.youtube.com/playlist?list=PLrAl6rYgs4IvGFBDEaVGFXt6k2GiOFWjS',
  'https://soundcloud.com/discover/sets/weekly',
  'https://music.apple.com/playlist/todays-hits/pl.f4d106fed2bd41149aaacabb233eb5eb'
];

const ConversionForm: React.FC<ConversionFormProps> = ({ onStartConversion }) => {
  const [sourceUrl, setSourceUrl] = useState('');
  const [targetPlatform, setTargetPlatform] = useState<Platform>('youtube');
  const [detectedPlatform, setDetectedPlatform] = useState<Platform | null>(null);

  const detectPlatform = (url: string): Platform | null => {
    if (url.includes('spotify.com')) return 'spotify';
    if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('music.youtube.com')) return 'youtube';
    if (url.includes('soundcloud.com')) return 'soundcloud';
    if (url.includes('music.apple.com')) return 'apple';
    return null;
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setSourceUrl(url);
    setDetectedPlatform(detectPlatform(url));
  };

  const handleSampleUrl = (url: string) => {
    setSourceUrl(url);
    setDetectedPlatform(detectPlatform(url));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sourceUrl.trim() && targetPlatform) {
      onStartConversion(sourceUrl.trim(), targetPlatform);
    }
  };

  const isValidUrl = sourceUrl.trim().length > 0 && detectedPlatform !== null;

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* URL Input */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm">
            <div className="flex items-center mb-4">
              <Link className="w-5 h-5 text-primary-400 mr-2" />
              <h2 className="text-xl font-semibold">Paste Your Playlist Link</h2>
            </div>
            
            <div className="relative">
              <input
                type="url"
                value={sourceUrl}
                onChange={handleUrlChange}
                placeholder="https://open.spotify.com/playlist/... or https://music.youtube.com/playlist?list=..."
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-4 text-white placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors"
                required
              />
              
              {detectedPlatform && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="flex items-center bg-gray-700 rounded-lg px-3 py-1.5 text-sm">
                    <span className="mr-2">
                      {platforms.find(p => p.id === detectedPlatform)?.icon}
                    </span>
                    <span className="text-gray-300">
                      {platforms.find(p => p.id === detectedPlatform)?.name}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            <p className="text-gray-400 text-sm mt-3">
              Supports public and unlisted playlists from all major platforms
            </p>

            {/* Sample URLs */}
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Try these sample URLs:</p>
              <div className="space-y-2">
                {sampleUrls.map((url, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSampleUrl(url)}
                    className="flex items-center text-xs text-gray-400 hover:text-primary-400 transition-colors group w-full text-left"
                  >
                    <Copy className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="truncate">{url}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Target Platform Selection */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm">
            <div className="flex items-center mb-6">
              <ArrowRight className="w-5 h-5 text-primary-400 mr-2" />
              <h2 className="text-xl font-semibold">Convert To</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {platforms.filter(p => p.supportedAsTarget).map((platform) => (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => setTargetPlatform(platform.id)}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                    targetPlatform === platform.id
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-gray-700 hover:border-gray-600 bg-gray-800/30'
                  }`}
                  disabled={detectedPlatform === platform.id}
                >
                  {detectedPlatform === platform.id && (
                    <div className="absolute inset-0 bg-gray-600/20 rounded-xl flex items-center justify-center">
                      <span className="text-xs text-gray-400">Source Platform</span>
                    </div>
                  )}
                  
                  <div className="text-2xl mb-2">{platform.icon}</div>
                  <div className="text-sm font-medium text-white">{platform.name}</div>
                  
                  {targetPlatform === platform.id && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-primary-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Convert Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!isValidUrl}
              className={`group relative px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                isValidUrl
                  ? 'bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-500 hover:to-blue-500 text-white shadow-lg hover:shadow-primary-500/25'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span className="flex items-center">
                <Music className="w-5 h-5 mr-2" />
                Convert Playlist
                <ArrowRight className={`w-5 h-5 ml-2 transition-transform ${
                  isValidUrl ? 'group-hover:translate-x-1' : ''
                }`} />
              </span>
              
              {isValidUrl && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-blue-600/20 rounded-xl blur-xl -z-10" />
              )}
            </button>
          </div>
        </form>

        {/* Supported Platforms Info */}
        <div id="supported-platforms" className="mt-16">
          <h3 className="text-lg font-semibold mb-6 text-center">Supported Platforms</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {platforms.map((platform) => (
              <div
                key={platform.id}
                className="bg-gray-900/30 border border-gray-800 rounded-xl p-4 text-center"
              >
                <div className="text-2xl mb-2">{platform.icon}</div>
                <div className="text-sm font-medium text-white mb-1">{platform.name}</div>
                <div className="flex justify-center space-x-2 text-xs">
                  {platform.supportedAsSource && (
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded">From</span>
                  )}
                  {platform.supportedAsTarget && (
                    <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded">To</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              🎵 <strong>Demo Mode:</strong> Currently using mock data for all conversions. Real API integration coming soon!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConversionForm;