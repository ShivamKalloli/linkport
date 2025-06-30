import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

/**
 * Create mirror playlist on target platform
 */
export async function createMirrorPlaylist(sourcePlaylist, matches, targetPlatform) {
  try {
    // Generate unique playlist ID
    const playlistId = uuidv4().substring(0, 8);
    
    // Filter successful matches
    const successfulMatches = matches.filter(m => m.matchedSong);
    
    // Create shareable URL
    const shareableUrl = `https://linkport.app/pl/${playlistId}`;
    
    // Generate QR code for the shareable URL
    const qrCodeDataUrl = await QRCode.toDataURL(shareableUrl, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    // Create mirror playlist data
    const mirrorPlaylist = {
      id: playlistId,
      title: sourcePlaylist.title,
      description: `Converted from ${sourcePlaylist.platform} by LinkPort`,
      platform: targetPlatform,
      songs: successfulMatches.map(m => m.matchedSong),
      originalUrl: generatePlatformUrl(playlistId, targetPlatform),
      shareableUrl: shareableUrl,
      qrCode: qrCodeDataUrl,
      createdAt: new Date().toISOString(),
      totalDuration: calculateTotalDuration(successfulMatches.map(m => m.matchedSong))
    };
    
    // In production, this would create actual playlists using platform APIs
    // For demo, we'll simulate the creation process
    await simulatePlaylistCreation(mirrorPlaylist, targetPlatform);
    
    return mirrorPlaylist;
  } catch (error) {
    console.error('Error creating mirror playlist:', error);
    throw new Error('Failed to create mirror playlist');
  }
}

async function simulatePlaylistCreation(playlist, platform) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log(`Created mirror playlist "${playlist.title}" on ${platform}`);
  console.log(`Playlist ID: ${playlist.id}`);
  console.log(`Songs added: ${playlist.songs.length}`);
  console.log(`QR Code generated for: ${playlist.shareableUrl}`);
  
  return true;
}

function generatePlatformUrl(playlistId, platform) {
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
      return `https://linkport.app/pl/${playlistId}`;
  }
}

function calculateTotalDuration(songs) {
  // Estimate duration based on number of songs (average 3.5 minutes per song)
  return songs.length * 210; // 210 seconds = 3.5 minutes
}