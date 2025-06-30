import React, { useEffect, useState } from 'react';
import { Music, Loader, Search, CheckCircle, AlertCircle } from 'lucide-react';

interface ConversionProgressProps {
  sourceUrl: string;
  targetPlatform: string;
  progress: any;
}

const ConversionProgress: React.FC<ConversionProgressProps> = ({
  sourceUrl,
  targetPlatform,
  progress,
}) => {
  const [currentStage, setCurrentStage] = useState('extracting');
  const [processedSongs, setProcessedSongs] = useState(0);
  const [totalSongs, setTotalSongs] = useState(15); // Demo value
  const [currentSong, setCurrentSong] = useState('');

  // Demo progress simulation
  useEffect(() => {
    const stages = ['extracting', 'matching', 'creating', 'finalizing'];
    let stageIndex = 0;
    let songCount = 0;

    const interval = setInterval(() => {
      if (stageIndex < stages.length) {
        setCurrentStage(stages[stageIndex]);
        
        if (stages[stageIndex] === 'matching' && songCount < totalSongs) {
          songCount++;
          setProcessedSongs(songCount);
          setCurrentSong(`Song ${songCount} of ${totalSongs}`);
        }
        
        if (songCount >= totalSongs || stages[stageIndex] !== 'matching') {
          setTimeout(() => {
            stageIndex++;
          }, 2000);
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [totalSongs]);

  const getStageInfo = (stage: string) => {
    switch (stage) {
      case 'extracting':
        return {
          title: 'Extracting Playlist',
          description: 'Analyzing your playlist and extracting song information...',
          icon: <Music className="w-6 h-6" />,
          color: 'text-blue-400',
        };
      case 'matching':
        return {
          title: 'Matching Songs',
          description: 'Finding the best matches on the target platform...',
          icon: <Search className="w-6 h-6" />,
          color: 'text-yellow-400',
        };
      case 'creating':
        return {
          title: 'Creating Playlist',
          description: 'Building your new playlist...',
          icon: <Loader className="w-6 h-6 animate-spin" />,
          color: 'text-purple-400',
        };
      case 'finalizing':
        return {
          title: 'Finalizing',
          description: 'Adding finishing touches and generating shareable link...',
          icon: <CheckCircle className="w-6 h-6" />,
          color: 'text-green-400',
        };
      default:
        return {
          title: 'Processing',
          description: 'Working on your playlist...',
          icon: <Loader className="w-6 h-6 animate-spin" />,
          color: 'text-primary-400',
        };
    }
  };

  const stageInfo = getStageInfo(currentStage);
  const progressPercentage = currentStage === 'matching' 
    ? (processedSongs / totalSongs) * 100 
    : currentStage === 'extracting' ? 25 
    : currentStage === 'creating' ? 75 
    : 90;

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
              <Music className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Converting Your Playlist</h2>
            <p className="text-gray-400">
              Converting to {targetPlatform === 'youtube' ? 'YouTube Music' : targetPlatform}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-primary-500 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Current Stage */}
          <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
            <div className="flex items-center mb-4">
              <div className={`${stageInfo.color} mr-3`}>
                {stageInfo.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{stageInfo.title}</h3>
                <p className="text-gray-400 text-sm">{stageInfo.description}</p>
              </div>
            </div>
            
            {currentStage === 'matching' && (
              <div className="mt-4">
                <div className="text-sm text-gray-300 mb-2">
                  Processing: {currentSong}
                </div>
                <div className="text-xs text-gray-500">
                  {processedSongs} of {totalSongs} songs processed
                </div>
              </div>
            )}
          </div>

          {/* Stage Indicators */}
          <div className="flex justify-between items-center">
            {['extracting', 'matching', 'creating', 'finalizing'].map((stage, index) => {
              const isActive = stage === currentStage;
              const isCompleted = ['extracting', 'matching', 'creating', 'finalizing'].indexOf(currentStage) > index;
              
              return (
                <div key={stage} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-primary-500 text-white' 
                      : isCompleted 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-700 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <div className={`text-xs mt-2 capitalize ${
                    isActive ? 'text-white' : isCompleted ? 'text-green-400' : 'text-gray-500'
                  }`}>
                    {stage}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Estimated Time */}
          <div className="text-center mt-8 text-sm text-gray-400">
            <p>Estimated time remaining: ~30 seconds</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConversionProgress;