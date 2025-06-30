import React from 'react';
import { ArrowRight, Shield, Zap, Globe, Award } from 'lucide-react';

const Hero = () => {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <div className="inline-flex items-center bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 text-sm text-primary-300 mb-6">
            <Award className="w-4 h-4 mr-2" />
            Bolt AI Hackathon Project • No Login Required • Privacy First
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Convert Playlists
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary-400 to-blue-400 bg-clip-text text-transparent">
              Across Platforms
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform your music playlists between Spotify, YouTube Music, and SoundCloud 
            instantly. No accounts, no logins, just paste a link and get your music everywhere.
          </p>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-8 max-w-2xl mx-auto">
            <p className="text-yellow-300 text-sm">
              🎵 <strong>Try it now!</strong> Use any public playlist URL below to see the magic happen
            </p>
          </div>
        </div>
        
        <div id="features" className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <Shield className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Privacy First</h3>
            <p className="text-gray-400 text-sm">
              No login required. We only access public playlist links, keeping your data secure.
            </p>
          </div>
          
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
            <p className="text-gray-400 text-sm">
              Advanced AI matching algorithms ensure accurate and rapid playlist conversions.
            </p>
          </div>
          
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <Globe className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Universal Bridge</h3>
            <p className="text-gray-400 text-sm">
              Connect all major music platforms with intelligent song matching technology.
            </p>
          </div>
        </div>

        {/* How It Works Section */}
        <div id="how-it-works" className="mb-12">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-400 font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Paste URL</h3>
              <p className="text-gray-400 text-sm">Copy your playlist link from any supported platform</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-400 font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">AI Analysis</h3>
              <p className="text-gray-400 text-sm">Our AI extracts and analyzes all songs in your playlist</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-400 font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Smart Matching</h3>
              <p className="text-gray-400 text-sm">Find the best matches on your target platform</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-400 font-bold">4</span>
              </div>
              <h3 className="font-semibold mb-2">Get Results</h3>
              <p className="text-gray-400 text-sm">Receive your converted playlist with detailed analytics</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center text-primary-400 animate-pulse">
            <span className="text-lg font-medium mr-2">Get Started Below</span>
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;