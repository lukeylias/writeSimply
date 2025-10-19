import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Music, Volume2, List, Repeat } from 'lucide-react';

interface MusicPlayerProps {
  onClose: () => void;
}

export default function MusicPlayer({ onClose }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [showList, setShowList] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const [isRepeat, setIsRepeat] = useState(false); // Repeat state

  const totalTime = 210; // seconds
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const songs = [
    { title: 'Midnight Dreams', artist: 'Aurora Waves' },
    { title: 'Sunset Boulevard', artist: 'Luna Sky' },
    { title: 'Ocean Waves', artist: 'Blue Horizon' },
    { title: 'City Lights', artist: 'Neon Night' },
    { title: 'Starlight', artist: 'Cosmic Beats' },
  ];

  // Dummy playback effect
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            if (isRepeat) return 0; // loop if repeat
            clearInterval(intervalRef.current!);
            return 100;
          }
          return prev + 0.5;
        });
      }, 200);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, isRepeat]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTime = Math.floor((progress / 100) * totalTime);

  return (
    <div className="fixed top-20 right-8 z-50 w-72 bg-black/80 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-white/20">

      {/* Song Info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-blue-500/30 rounded-lg flex items-center justify-center">
          <Music className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-bold text-sm">{songs[currentSong].title}</h3>
          <p className="text-white/70 text-xs">{songs[currentSong].artist}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => setProgress(parseInt(e.target.value))}
          style={{
            background: `linear-gradient(to right, #4ade80 0%, #4ade80 ${progress}%, #6b7280 ${progress}%, #6b7280 100%)`
          }}
          className="w-full h-1 rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-300
            [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gray-300
          "
        />
        <div className="flex justify-between text-white text-xs mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(totalTime)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="text-white hover:scale-110 transition-transform p-1">
            <SkipBack className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-white hover:scale-110 transition-transform p-2 bg-white/20 rounded-full"
          >
            {isPlaying ? <Pause className="w-4 h-4" fill="white" /> : <Play className="w-4 h-4" fill="white" />}
          </button>
          <button className="text-white hover:scale-110 transition-transform p-1">
            <SkipForward className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowList(prev => !prev)}
            className="text-white hover:scale-110 transition-transform p-1"
            title="Toggle Playlist"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsRepeat(prev => !prev)}
            className={`hover:scale-110 transition-transform p-1 ${isRepeat ? 'text-green-400' : 'text-white'}`}
            title="Repeat"
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-white" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value))}
            style={{
              background: `linear-gradient(to right, #4ade80 0%, #4ade80 ${volume}%, #6b7280 ${volume}%, #6b7280 100%)`
            }}
            className="w-16 h-1 rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-300
              [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gray-300
            "
          />
        </div>
      </div>

      {/* Playlist */}
      {showList && (
        <div className="mt-3 bg-gray-900/90 rounded-lg max-h-40 overflow-y-auto p-2 space-y-2 hide-scrollbar">
          {songs.map((song, index) => (
            <div
              key={index}
              className={`flex justify-between items-center p-2 rounded hover:bg-green-500/20 cursor-pointer transition-colors ${
                index === currentSong ? 'bg-green-500/30 font-semibold' : ''
              }`}
              onClick={() => setCurrentSong(index)}
            >
              <div>
                <p className="text-white text-sm truncate">{song.title}</p>
                <p className="text-white/70 text-xs truncate">{song.artist}</p>
              </div>
              <span className="text-white/70 text-xs">{index + 1}</span>
            </div>
          ))}
        </div>
      )}

      {/* Scrollbar hide style */}
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>
    </div>
  );
}
