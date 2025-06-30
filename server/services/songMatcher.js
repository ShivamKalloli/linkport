import * as Fuzz from 'fuzzball';

/**
 * Match songs on target platform using mock data
 */
export async function matchSongs(songs, targetPlatform) {
  console.log(`🔍 Matching ${songs.length} songs for ${targetPlatform}`);
  
  const matches = [];
  
  for (const song of songs) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));
    
    // Generate realistic mock results
    const mockResults = generateMockSearchResults(song, targetPlatform);
    
    if (mockResults.length === 0) {
      matches.push({
        originalSong: song,
        status: 'not_found'
      });
    } else {
      const bestMatch = findBestFuzzyMatch(song, mockResults);
      matches.push({
        originalSong: song,
        matchedSong: bestMatch.song,
        status: bestMatch.confidence > 0.9 ? 'matched' : bestMatch.confidence > 0.7 ? 'partial' : 'not_found',
        confidence: bestMatch.confidence,
        alternativeMatches: mockResults.slice(1, 3)
      });
    }
  }
  
  const stats = {
    matched: matches.filter(m => m.status === 'matched').length,
    partial: matches.filter(m => m.status === 'partial').length,
    notFound: matches.filter(m => m.status === 'not_found').length,
  };
  
  console.log(`✅ Matching complete: ${stats.matched} matched, ${stats.partial} partial, ${stats.notFound} not found`);
  
  return matches;
}

function generateMockSearchResults(originalSong, platform) {
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

function findBestFuzzyMatch(originalSong, searchResults) {
  let bestMatch = null;
  let bestScore = 0;
  
  for (const result of searchResults) {
    const titleScore = Fuzz.ratio(
      originalSong.title.toLowerCase(),
      result.title.toLowerCase()
    );
    const artistScore = Fuzz.ratio(
      originalSong.artist.toLowerCase(),
      result.artist.toLowerCase()
    );
    
    const combinedScore = (titleScore * 0.7 + artistScore * 0.3) / 100;
    
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