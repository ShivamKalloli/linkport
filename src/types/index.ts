export interface Song {
  title: string;
  artist: string;
  album?: string;
  duration?: number;
  originalUrl?: string;
}

export interface Playlist {
  title: string;
  description?: string;
  songs: Song[];
  platform: string;
  originalUrl: string;
  totalDuration?: number;
}

export interface SongMatch {
  originalSong: Song;
  matchedSong?: Song;
  status: 'matched' | 'partial' | 'not_found';
  confidence?: number;
  alternativeMatches?: Song[];
}

export interface ConversionProgress {
  totalSongs: number;
  processedSongs: number;
  currentSong?: string;
  stage: 'extracting' | 'matching' | 'creating' | 'finalizing';
}

export interface ConversionResults {
  sourcePlaylist: Playlist;
  targetPlaylist: Playlist;
  matches: SongMatch[];
  shareableUrl: string;
  qrCode?: string;
  stats: {
    totalSongs: number;
    matchedSongs: number;
    partialMatches: number;
    notFound: number;
  };
}

export interface ConversionState {
  status: 'idle' | 'processing' | 'completed' | 'error';
  sourceUrl: string;
  targetPlatform: string;
  playlist: Playlist | null;
  progress: ConversionProgress | null;
  results: ConversionResults | null;
  error: string | null;
}

export type Platform = 'spotify' | 'youtube' | 'soundcloud' | 'apple';

export interface PlatformInfo {
  id: Platform;
  name: string;
  icon: string;
  color: string;
  supportedAsSource: boolean;
  supportedAsTarget: boolean;
}