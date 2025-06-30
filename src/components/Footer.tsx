import React from 'react';
import { Music, Heart, Github, Mail, ExternalLink, HelpCircle, Shield, FileText } from 'lucide-react';

const Footer = () => {
  const handleLinkClick = (type: string) => {
    switch (type) {
      case 'help':
        alert('Help Center: For support, please contact us via email or GitHub issues.');
        break;
      case 'privacy':
        alert('Privacy Policy: LinkPort is privacy-first. We only access public playlist links and do not store any personal data.');
        break;
      case 'terms':
        alert('Terms of Service: LinkPort is provided as-is for educational and personal use. Please respect platform terms of service.');
        break;
      case 'issues':
        window.open('https://github.com/linkport-app/linkport/issues', '_blank');
        break;
      case 'features':
        alert('Feature Requests: Please submit feature requests via GitHub issues or contact us directly.');
        break;
      default:
        break;
    }
  };

  return (
    <footer className="border-t border-gray-800/50 mt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Built with Bolt Badge */}
        <div className="text-center mb-8">
          <a 
            href="https://bolt.new" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-full px-6 py-3 text-sm text-orange-300 hover:text-orange-200 transition-colors group"
          >
            <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-xs">⚡</span>
            </div>
            <span className="font-medium">Built with Bolt</span>
            <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-blue-400 bg-clip-text text-transparent">
                  LinkPort
                </h3>
                <p className="text-xs text-gray-400">Universal Playlist Bridge</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Convert music playlists between streaming platforms instantly, with no login required. 
              Privacy-first, lightning-fast, and completely free.
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400 mx-1" />
              <span>for music lovers everywhere</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">Playlist Conversion</button></li>
              <li><button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">Smart Matching</button></li>
              <li><span className="text-green-400">✓ No Login Required</span></li>
              <li><span className="text-green-400">✓ Privacy First</span></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><button onClick={() => handleLinkClick('help')} className="hover:text-white transition-colors flex items-center"><HelpCircle className="w-3 h-3 mr-1" />Help Center</button></li>
              <li><button onClick={() => document.getElementById('supported-platforms')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">Supported Platforms</button></li>
              <li><button onClick={() => handleLinkClick('issues')} className="hover:text-white transition-colors">Report Issues</button></li>
              <li><button onClick={() => handleLinkClick('features')} className="hover:text-white transition-colors">Feature Requests</button></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 LinkPort. All rights reserved. • 
            <button onClick={() => handleLinkClick('privacy')} className="hover:text-white transition-colors ml-1 inline-flex items-center">
              <Shield className="w-3 h-3 mr-1" />Privacy Policy
            </button> • 
            <button onClick={() => handleLinkClick('terms')} className="hover:text-white transition-colors ml-1 inline-flex items-center">
              <FileText className="w-3 h-3 mr-1" />Terms of Service
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <a 
              href="https://github.com/linkport-app/linkport" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              title="View on GitHub"
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
            <a 
              href="mailto:support@linkport.app" 
              className="text-gray-400 hover:text-white transition-colors"
              title="Contact Support"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;