import { v4 as uuidv4 } from 'uuid';

// Mock data for different platforms
const mockPlaylists = {
  spotify: {
    title: "Today's Top Hits",
    description: "The most played songs right now",
    platform: "spotify",
    songs: [
      { title: "As It Was", artist: "Harry Styles", album: "Harry's House" },
      { title: "Anti-Hero", artist: "Taylor Swift", album: "Midnights" },
      { title: "Flowers", artist: "Miley Cyrus", album: "Endless Summer Vacation" },
      { title: "Unholy", artist: "Sam Smith ft. Kim Petras", album: "Gloria" },
      { title: "Calm Down", artist: "Rema & Selena Gomez", album: "Rave & Roses" },
      { title: "Lavender Haze", artist: "Taylor Swift", album: "Midnights" },
      { title: "Creepin'", artist: "Metro Boomin, The Weeknd, 21 Savage", album: "Heroes & Villains" },
      { title: "Kill Bill", artist: "SZA", album: "SOS" },
      { title: "Vampire", artist: "Olivia Rodrigo", album: "GUTS" },
      { title: "Cruel Summer", artist: "Taylor Swift", album: "Lover" },
    ],
    totalDuration: 2100
  },
  youtube: {
    title: "YouTube Music Trending",
    description: "What's trending on YouTube Music",
    platform: "youtube",
    songs: [
      { title: "Paint The Town Red", artist: "Doja Cat", album: "Scarlet" },
      { title: "Greedy", artist: "Tate McRae", album: "Think Later" },
      { title: "Water", artist: "Tyla", album: "Water" },
      { title: "Lovin On Me", artist: "Jack Harlow", album: "Lovin On Me" },
      { title: "Stick Season", artist: "Noah Kahan", album: "I Was / I Am" },
      { title: "What It Is (Block Boy)", artist: "Doechii", album: "Alligator Bites Never Heal" },
      { title: "Rich Baby Daddy", artist: "Drake ft. Sexyy Red & SZA", album: "For All The Dogs" },
      { title: "Northern Attitude", artist: "Noah Kahan", album: "Stick Season" },
      { title: "Dance The Night", artist: "Dua Lipa", album: "Barbie The Album" },
      { title: "Snooze", artist: "SZA", album: "SOS" },
    ],
    totalDuration: 1980
  },
  soundcloud: {
    title: "SoundCloud Weekly",
    description: "Fresh tracks from emerging artists",
    platform: "soundcloud",
    songs: [
      { title: "Midnight Dreams", artist: "Luna Wave", album: "Neon Nights" },
      { title: "Electric Pulse", artist: "Synth Master", album: "Digital Horizon" },
      { title: "Ocean Breeze", artist: "Coastal Vibes", album: "Summer Sessions" },
      { title: "City Lights", artist: "Urban Echo", album: "Metropolitan" },
      { title: "Starfall", artist: "Cosmic Journey", album: "Interstellar" },
      { title: "Neon Glow", artist: "Retro Future", album: "80s Revival" },
      { title: "Mountain High", artist: "Nature Sounds", album: "Wilderness" },
      { title: "Digital Love", artist: "Cyber Romance", album: "Virtual Reality" },
    ],
    totalDuration: 1680
  },
  apple: {
    title: "Apple Music Hits",
    description: "Popular songs from Apple Music",
    platform: "apple",
    songs: [
      { title: "As It Was", artist: "Harry Styles", album: "Harry's House" },
      { title: "Anti-Hero", artist: "Taylor Swift", album: "Midnights" },
      { title: "Flowers", artist: "Miley Cyrus", album: "Endless Summer Vacation" },
      { title: "Unholy", artist: "Sam Smith ft. Kim Petras", album: "Gloria" },
      { title: "Calm Down", artist: "Rema & Selena Gomez", album: "Rave & Roses" },
    ],
    totalDuration: 1200
  }
};

function detectPlatform(url: string): string {
  if (url.includes('spotify.com')) return 'spotify';
  if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('music.youtube.com')) return 'youtube';
  if (url.includes('soundcloud.com')) return 'soundcloud';
  if (url.includes('music.apple.com')) return 'apple';
  throw new Error('Unable to detect platform from URL');
}

function generateMockSearchResults(originalSong: any, platform: string) {
  const variations = [];
  
  // Perfect match (high confidence)
  if (Math.random() > 0.15) {
    variations.push({
      title: originalSong.title,
      artist: originalSong.artist,
      album: originalSong.album || 'Unknown Album'
    });
  }
  
  // Platform-specific variations
  if (platform === 'youtube') {
    variations.push({
      title: `${originalSong.title} - ${originalSong.artist}`,
      artist: `${originalSong.artist} - Topic`,
      album: originalSong.album || 'Auto-Generated'
    });
  }
  
  // Remastered version
  if (Math.random() > 0.3) {
    variations.push({
      title: `${originalSong.title} (Remastered)`,
      artist: originalSong.artist,
      album: `${originalSong.album || 'Unknown Album'} (Remastered)`
    });
  }
  
  // Live version
  if (Math.random() > 0.5) {
    variations.push({
      title: `${originalSong.title} (Live)`,
      artist: originalSong.artist,
      album: 'Live Album'
    });
  }
  
  return variations.slice(0, Math.floor(Math.random() * 3) + 1);
}

function findBestFuzzyMatch(originalSong: any, searchResults: any[]) {
  if (searchResults.length === 0) {
    return null;
  }
  
  let bestMatch = null;
  let bestScore = 0;
  
  for (const result of searchResults) {
    // Simple string similarity calculation
    const titleSimilarity = calculateSimilarity(
      originalSong.title.toLowerCase(),
      result.title.toLowerCase()
    );
    const artistSimilarity = calculateSimilarity(
      originalSong.artist.toLowerCase(),
      result.artist.toLowerCase()
    );
    
    const combinedScore = (titleSimilarity * 0.7 + artistSimilarity * 0.3);
    
    if (combinedScore > bestScore) {
      bestScore = combinedScore;
      bestMatch = {
        song: result,
        confidence: combinedScore
      };
    }
  }
  
  return bestMatch || {
    song: searchResults[0],
    confidence: 0.5
  };
}

function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

async function generateQRCode(url: string): Promise<string> {
  // Simple QR code data URL generation (mock)
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
      <rect width="256" height="256" fill="white"/>
      <rect x="20" y="20" width="216" height="216" fill="black"/>
      <rect x="40" y="40" width="176" height="176" fill="white"/>
      <text x="128" y="128" text-anchor="middle" fill="black" font-size="12">QR Code</text>
    </svg>
  `)}`;
}

export async function mockConvertPlaylist(sourceUrl: string, targetPlatform: string) {
  // Validate inputs
  if (!sourceUrl || !targetPlatform) {
    throw new Error('Missing required parameters: sourceUrl and targetPlatform are required');
  }

  // Validate URL format
  try {
    new URL(sourceUrl);
  } catch (urlError) {
    throw new Error('Invalid URL format. Please provide a valid playlist URL.');
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  try {
    const sourcePlatform = detectPlatform(sourceUrl);
    const sourcePlaylist = {
      ...mockPlaylists[sourcePlatform as keyof typeof mockPlaylists],
      originalUrl: sourceUrl
    };
    
    // Generate matches
    const matches = [];
    for (const song of sourcePlaylist.songs) {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100));
      
      const mockResults = generateMockSearchResults(song, targetPlatform);
      
      if (mockResults.length === 0) {
        matches.push({
          originalSong: song,
          status: 'not_found'
        });
      } else {
        const bestMatch = findBestFuzzyMatch(song, mockResults);
        if (bestMatch) {
          matches.push({
            originalSong: song,
            matchedSong: bestMatch.song,
            status: bestMatch.confidence > 0.9 ? 'matched' : bestMatch.confidence > 0.7 ? 'partial' : 'not_found',
            confidence: bestMatch.confidence,
            alternativeMatches: mockResults.slice(1, 3)
          });
        } else {
          matches.push({
            originalSong: song,
            status: 'not_found'
          });
        }
      }
    }
    
    // Generate playlist ID and URLs
    const playlistId = uuidv4().substring(0, 8);
    const shareableUrl = `https://linkport.netlify.app/pl/${playlistId}`;
    const qrCode = await generateQRCode(shareableUrl);
    
    // Create target playlist
    const successfulMatches = matches.filter(m => m.matchedSong);
    const targetPlaylist = {
      id: playlistId,
      title: sourcePlaylist.title,
      description: `Converted from ${sourcePlatform} by LinkPort`,
      platform: targetPlatform,
      songs: successfulMatches.map(m => m.matchedSong),
      originalUrl: generatePlatformUrl(playlistId, targetPlatform),
      shareableUrl: shareableUrl,
      qrCode: qrCode,
      createdAt: new Date().toISOString(),
      totalDuration: successfulMatches.length * 210
    };
    
    // Calculate stats
    const stats = {
      totalSongs: matches.length,
      matchedSongs: matches.filter(m => m.status === 'matched').length,
      partialMatches: matches.filter(m => m.status === 'partial').length,
      notFound: matches.filter(m => m.status === 'not_found').length,
    };
    
    return {
      sourcePlaylist,
      targetPlaylist,
      matches,
      shareableUrl,
      qrCode,
      stats
    };
    
  } catch (error) {
    console.error('Mock API Error:', error);
    throw new Error(`Failed to convert playlist: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function generatePlatformUrl(playlistId: string, platform: string): string {
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
      return `https://linkport.netlify.app/pl/${playlistId}`;
  }
}