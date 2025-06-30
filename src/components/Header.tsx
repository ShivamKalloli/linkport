import React from 'react';
import { Music, Github } from 'lucide-react';

const Header = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="border-b border-gray-800/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-blue-400 bg-clip-text text-transparent">
                LinkPort
              </h1>
              <p className="text-xs text-gray-400">Universal Playlist Bridge</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('features')}
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              How it Works
            </button>
            <button 
              onClick={() => scrollToSection('supported-platforms')}
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Platforms
            </button>
          </nav>
          
          <div className="flex items-center space-x-4">
            {/* Official Bolt Badge - Top Right as recommended */}
            <a 
              href="https://bolt.new" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 hover:scale-105 transition-transform"
              title="Built with Bolt"
            >
              <img 
                src="/white_circle_360x360.png" 
                alt="Built with Bolt" 
                className="w-8 h-8 rounded-full"
              />
            </a>
            
            <a 
              href="https://github.com/linkport-app/linkport" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="https://x.com/linkport_app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              title="Follow on X"
            >
              <div className="w-5 h-5 bg-black rounded-sm flex items-center justify-center">
                <span className="text-white text-xs font-bold">𝕏</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;