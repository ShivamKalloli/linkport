import * as Fuzz from 'fuzzball';

/**
 * Match songs on target platform using fuzzy matching
 */
export async function matchSongs(songs, targetPlatform) {
  const matches = [];
  
  for (const song of songs) {
    try {
      const match = await findSongMatch(song, targetPlatform);
      matches.push(match);
    } catch (error) {
      console.error(`Failed to match song: ${song.title} - ${song.artist}`, error);
      matches.push({
        originalSong: song,
        status: 'not_found'
      });
    }
  }
  
  return matches;
}

async function findSongMatch(song, targetPlatform) {
  // Mock implementation with realistic results that showcase different match types
  const searchQuery = `${song.title} ${song.artist}`;
  
  // Simulate API search delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
  
  // Generate realistic mock search results based on the song
  const mockResults = generateMockSearchResults(song, targetPlatform);
  
  if (mockResults.length === 0) {
    return {
      originalSong: song,
      status: 'not_found'
    };
  }
  
  // Find best match using fuzzy string matching
  const bestMatch = findBestFuzzyMatch(song, mockResults);
  
  return {
    originalSong: song,
    matchedSong: bestMatch.song,
    status: bestMatch.confidence > 0.9 ? 'matched' : bestMatch.confidence > 0.7 ? 'partial' : 'not_found',
    confidence: bestMatch.confidence,
    alternativeMatches: mockResults.slice(1, 3) // Include alternatives
  };
}

function generateMockSearchResults(originalSong, platform) {
  // Create realistic variations that demonstrate different matching scenarios
  const variations = [];
  
  // Perfect match (high confidence)
  if (Math.random() > 0.2) {
    variations.push({
      title: originalSong.title,
      artist: originalSong.artist,
      album: originalSong.album || 'Unknown Album'
    });
  }
  
  // Remastered version (still high confidence)
  if (Math.random() > 0.3) {
    variations.push({
      title: `${originalSong.title} (Remastered)`,
      artist: originalSong.artist,
      album: `${originalSong.album || 'Unknown Album'} (Remastered)`
    });
  }
  
  // Live version (partial match)
  if (Math.random() > 0.4) {
    variations.push({
      title: `${originalSong.title} (Live)`,
      artist: originalSong.artist,
      album: 'Live Album'
    });
  }
  
  // Cover version (partial match)
  if (Math.random() > 0.5) {
    variations.push({
      title: originalSong.title,
      artist: `${originalSong.artist} Cover Band`,
      album: 'Cover Album'
    });
  }
  
  // Acoustic version (partial match)
  if (Math.random() > 0.6) {
    variations.push({
      title: `${originalSong.title} (Acoustic Version)`,
      artist: originalSong.artist,
      album: 'Acoustic Sessions'
    });
  }
  
  // Platform-specific variations
  if (platform === 'youtube') {
    // YouTube often has user uploads with different naming
    variations.push({
      title: `${originalSong.title} - ${originalSong.artist}`,
      artist: `${originalSong.artist} - Topic`,
      album: originalSong.album || 'Auto-Generated'
    });
  }
  
  if (platform === 'soundcloud') {
    // SoundCloud often has remix versions
    if (Math.random() > 0.7) {
      variations.push({
        title: `${originalSong.title} (Remix)`,
        artist: `${originalSong.artist} ft. Various Artists`,
        album: 'Remix Collection'
      });
    }
  }
  
  // Demonstrate some songs that won't be found (for realistic results)
  const notFoundSongs = ['Sweet Child O\' Mine', 'Stairway to Heaven'];
  if (notFoundSongs.some(title => originalSong.title.includes(title)) && Math.random() > 0.5) {
    return []; // Simulate not found
  }
  
  // Return 1-3 variations to simulate real search results
  return variations.slice(0, Math.floor(Math.random() * 3) + 1);
}

function findBestFuzzyMatch(originalSong, searchResults) {
  let bestMatch = null;
  let bestScore = 0;
  
  for (const result of searchResults) {
    // Calculate fuzzy match scores for title and artist
    const titleScore = Fuzz.ratio(
      originalSong.title.toLowerCase(),
      result.title.toLowerCase()
    );
    const artistScore = Fuzz.ratio(
      originalSong.artist.toLowerCase(),
      result.artist.toLowerCase()
    );
    
    // Weighted average (title is more important)
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