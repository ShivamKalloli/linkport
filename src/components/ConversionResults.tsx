import React, { useState } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  ExternalLink, 
  Copy, 
  Download, 
  QrCode,
  Music,
  ArrowLeft,
  Share,
  Info,
  Instagram,
  Facebook,
  MessageCircle
} from 'lucide-react';
import { ConversionResults as ConversionResultsType } from '../types';

interface ConversionResultsProps {
  results: ConversionResultsType;
  onReset: () => void;
}

const ConversionResults: React.FC<ConversionResultsProps> = ({ results, onReset }) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showPartialInfo, setShowPartialInfo] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(results.shareableUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL');
    }
  };

  const handleDownloadCSV = () => {
    const csvContent = [
      'Original Title,Original Artist,Matched Title,Matched Artist,Status,Confidence',
      ...results.matches.map(match => [
        match.originalSong.title,
        match.originalSong.artist,
        match.matchedSong?.title || '',
        match.matchedSong?.artist || '',
        match.status,
        match.confidence?.toFixed(2) || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${results.sourcePlaylist.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_conversion.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSocialShare = (platform: string) => {
    const text = `I just converted my "${results.sourcePlaylist.title}" playlist using LinkPort! 🎵 Check it out:`;
    const url = results.shareableUrl;
    
    switch (platform) {
      case 'x':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'instagram':
        // Instagram doesn't support direct link sharing, so we copy to clipboard
        navigator.clipboard.writeText(`${text} ${url}`).then(() => {
          alert('Link copied to clipboard! You can now paste it in your Instagram story or post.');
        });
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
    }
    setShowShareMenu(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'matched':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'partial':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'not_found':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'matched':
        return 'Perfect Match';
      case 'partial':
        return 'Partial Match';
      case 'not_found':
        return 'Not Found';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'matched':
        return 'text-green-400';
      case 'partial':
        return 'text-yellow-400';
      case 'not_found':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getMatchExplanation = (match: any) => {
    if (match.status === 'matched') {
      return 'Exact or near-exact match found';
    } else if (match.status === 'partial') {
      const original = match.originalSong;
      const matched = match.matchedSong;
      
      if (matched.title.includes('Remaster')) {
        return 'Found remastered version';
      } else if (matched.title.includes('Live')) {
        return 'Found live version';
      } else if (matched.title.includes('Acoustic')) {
        return 'Found acoustic version';
      } else if (matched.title.includes('Cover')) {
        return 'Found cover version';
      } else if (matched.artist.includes('Topic')) {
        return 'Found auto-generated version';
      } else {
        return 'Similar song found with slight differences';
      }
    } else {
      return 'No suitable match found on target platform';
    }
  };

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Playlist Converted Successfully! ✨
            </span>
          </h1>
          <p className="text-xl text-gray-400">
            "{results.sourcePlaylist.title}" is now available on{' '}
            {results.targetPlaylist.platform === 'youtube' ? 'YouTube Music' : results.targetPlaylist.platform}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <a
            href={results.targetPlaylist.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-500 hover:to-blue-500 rounded-2xl p-6 transition-all duration-200 flex items-center justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Open Playlist</h3>
              <p className="text-primary-100 text-sm">Listen now on {results.targetPlaylist.platform === 'youtube' ? 'YouTube Music' : results.targetPlaylist.platform}</p>
            </div>
            <ExternalLink className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          </a>

          <button
            onClick={handleCopyUrl}
            className="group bg-gray-900/50 border border-gray-800 hover:border-gray-700 rounded-2xl p-6 transition-all duration-200 flex items-center justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                {copiedUrl ? 'Copied!' : 'Copy Link'}
              </h3>
              <p className="text-gray-400 text-sm">Share with friends</p>
            </div>
            <Copy className={`w-6 h-6 transition-all ${copiedUrl ? 'text-green-400' : 'text-gray-400 group-hover:text-white'}`} />
          </button>
        </div>

        {/* Stats Overview */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Music className="w-6 h-6 text-primary-400 mr-2" />
            Conversion Summary
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{results.stats.totalSongs}</div>
              <div className="text-gray-400 text-sm">Total Songs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">{results.stats.matchedSongs}</div>
              <div className="text-gray-400 text-sm">Perfect Matches</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-1">{results.stats.partialMatches}</div>
              <div className="text-gray-400 text-sm">Partial Matches</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400 mb-1">{results.stats.notFound}</div>
              <div className="text-gray-400 text-sm">Not Found</div>
            </div>
          </div>

          <div className="mt-6 bg-gray-800/50 rounded-xl p-4">
            <div className="flex justify-between text-sm text-gray-300 mb-2">
              <span>Match Success Rate</span>
              <span>{Math.round(((results.stats.matchedSongs + results.stats.partialMatches) / results.stats.totalSongs) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-yellow-500 h-2 rounded-full"
                style={{ 
                  width: `${((results.stats.matchedSongs + results.stats.partialMatches) / results.stats.totalSongs) * 100}%` 
                }}
              />
            </div>
          </div>

          {/* Partial Match Info */}
          {results.stats.partialMatches > 0 && (
            <div className="mt-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-yellow-300 font-medium mb-2">About Partial Matches</h4>
                  <p className="text-yellow-200/80 text-sm mb-3">
                    Partial matches are songs that were found but may be different versions (live, remastered, covers, etc.). 
                    These are still added to your playlist but might not be the exact original recording.
                  </p>
                  <button
                    onClick={() => setShowPartialInfo(!showPartialInfo)}
                    className="text-yellow-300 text-sm hover:text-yellow-200 transition-colors"
                  >
                    {showPartialInfo ? 'Hide Details' : 'Show Examples'}
                  </button>
                  
                  {showPartialInfo && (
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="bg-yellow-500/5 rounded-lg p-3">
                        <div className="font-medium text-yellow-200">Common Partial Match Types:</div>
                        <ul className="mt-2 space-y-1 text-yellow-200/70">
                          <li>• <strong>Remastered:</strong> "Song Title (Remastered)" - Same song, better audio quality</li>
                          <li>• <strong>Live Versions:</strong> "Song Title (Live)" - Concert recordings</li>
                          <li>• <strong>Acoustic:</strong> "Song Title (Acoustic)" - Stripped-down versions</li>
                          <li>• <strong>Platform Variants:</strong> "Artist - Topic" - Auto-generated uploads</li>
                          <li>• <strong>Covers:</strong> Different artists performing the same song</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Detailed Song Matches */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Song Matching Details</h2>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {results.matches.map((match, index) => (
              <div 
                key={index}
                className="bg-gray-800/30 border border-gray-700 rounded-xl p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start flex-1">
                    {getStatusIcon(match.status)}
                    <div className="ml-4 flex-1">
                      <div className="font-medium text-white mb-1">
                        {match.originalSong.title} - {match.originalSong.artist}
                      </div>
                      {match.matchedSong && (
                        <div className="text-sm text-gray-400 mb-2">
                          → {match.matchedSong.title} - {match.matchedSong.artist}
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        {getMatchExplanation(match)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <div className={`text-sm font-medium ${getStatusColor(match.status)}`}>
                      {getStatusText(match.status)}
                    </div>
                    {match.confidence && (
                      <div className="text-xs text-gray-500 mt-1">
                        {Math.round(match.confidence * 100)}% match
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Actions */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <button
            onClick={handleDownloadCSV}
            className="flex items-center bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-xl transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Song List (.csv)
          </button>
          
          <button
            onClick={() => setShowQR(!showQR)}
            className="flex items-center bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-xl transition-colors"
          >
            <QrCode className="w-4 h-4 mr-2" />
            Show QR Code
          </button>
          
          {/* Improved Share Button */}
          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex items-center bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-xl transition-colors"
            >
              <Share className="w-4 h-4 mr-2" />
              Share Playlist
            </button>
            
            {/* Share Menu */}
            {showShareMenu && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-xl z-10 min-w-48">
                <div className="text-sm text-gray-300 mb-3 text-center">Share on social media</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSocialShare('x')}
                    className="flex items-center justify-center p-3 hover:bg-gray-700 rounded-lg transition-colors group"
                    title="Share on X (Twitter)"
                  >
                    <div className="w-5 h-5 bg-black rounded-sm flex items-center justify-center mr-2">
                      <span className="text-white text-xs font-bold">𝕏</span>
                    </div>
                    <span className="text-sm">X</span>
                  </button>
                  
                  <button
                    onClick={() => handleSocialShare('facebook')}
                    className="flex items-center justify-center p-3 hover:bg-gray-700 rounded-lg transition-colors"
                    title="Share on Facebook"
                  >
                    <Facebook className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm">Facebook</span>
                  </button>
                  
                  <button
                    onClick={() => handleSocialShare('instagram')}
                    className="flex items-center justify-center p-3 hover:bg-gray-700 rounded-lg transition-colors"
                    title="Copy for Instagram"
                  >
                    <Instagram className="w-5 h-5 text-pink-500 mr-2" />
                    <span className="text-sm">Instagram</span>
                  </button>
                  
                  <button
                    onClick={() => handleSocialShare('whatsapp')}
                    className="flex items-center justify-center p-3 hover:bg-gray-700 rounded-lg transition-colors"
                    title="Share on WhatsApp"
                  >
                    <MessageCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm">WhatsApp</span>
                  </button>
                </div>
                
                <button
                  onClick={() => setShowShareMenu(false)}
                  className="w-full mt-3 text-xs text-gray-400 hover:text-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>

        {/* QR Code Modal */}
        {showQR && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-sm w-full text-center">
              <h3 className="text-xl font-semibold mb-4">Scan to Access Playlist</h3>
              <div className="bg-white p-4 rounded-xl mb-4 inline-block">
                {results.qrCode ? (
                  <img 
                    src={results.qrCode} 
                    alt="QR Code for playlist" 
                    className="w-48 h-48 rounded"
                  />
                ) : (
                  <div className="w-48 h-48 bg-gray-200 rounded flex items-center justify-center">
                    <QrCode className="w-24 h-24 text-gray-400" />
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Scan with your phone to access the playlist
              </p>
              <button
                onClick={() => setShowQR(false)}
                className="bg-primary-600 hover:bg-primary-700 px-6 py-3 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Reset Button */}
        <div className="text-center">
          <button
            onClick={onReset}
            className="flex items-center bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-xl transition-colors mx-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Convert Another Playlist
          </button>
        </div>
      </div>
    </section>
  );
};

export default ConversionResults;