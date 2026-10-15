import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockStorage } from '../lib/mockStorage';
import { MediaAsset } from '../types';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import {
  Film,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Type,
  Scissors,
  Download,
  Save,
  Upload,
  Check,
  RotateCcw,
  Gauge
} from 'lucide-react';

export const VideoEditor: React.FC = () => {
  const { user } = useAuth();
  const [videoSrc, setVideoSrc] = useState<string>(
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  );
  const [videoTitle, setVideoTitle] = useState<string>('ocean_waves.mp4');

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(15);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);

  // Timeline Trimming Markers
  const [trimStart, setTrimStart] = useState<number>(0);
  const [trimEnd, setTrimEnd] = useState<number>(15);

  // Text Overlay parameters
  const [overlayText, setOverlayText] = useState<string>('FLOW AI STUDIO');
  const [textColor, setTextColor] = useState<string>('#38BDF8');
  const [textSize, setTextSize] = useState<number>(24);
  const [textPosition, setTextPosition] = useState<'top' | 'center' | 'bottom'>('bottom');

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setTrimEnd(video.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      // Loop or stop within trim bounds
      if (video.currentTime >= trimEnd) {
        video.currentTime = trimStart;
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [trimEnd, trimStart]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      if (video.currentTime < trimStart || video.currentTime >= trimEnd) {
        video.currentTime = trimStart;
      }
      video.play();
      setIsPlaying(true);
    }
  };

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoTitle(file.name);
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setTrimStart(0);
      setIsPlaying(false);
    }
  };

  const handleExport = () => {
    setIsExporting(true);

    // Realistic processing verification:
    setTimeout(() => {
      setIsExporting(false);

      const asset: MediaAsset = {
        id: 'vasset_edited_' + Date.now(),
        owner_id: user?.user_id || 'demo-user',
        asset_type: 'video',
        storage_path: `user-assets/edited_${videoTitle}`,
        public_url: videoSrc,
        mime_type: 'video/mp4',
        file_size: 14200000,
        title: `Trimmed - ${videoTitle.replace(/\.[^/.]+$/, '')}`,
        duration_seconds: trimEnd - trimStart,
        created_at: new Date().toISOString(),
        tags: ['Video Editor', `${(trimEnd - trimStart).toFixed(1)}s`, `${playbackRate}x`]
      };

      mockStorage.saveAsset(asset);
      setSaveSuccess(`Exported clip (${(trimEnd - trimStart).toFixed(1)}s) & saved to My Creations!`);
      setTimeout(() => setSaveSuccess(null), 4000);
    }, 1500);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${m}:${s < 10 ? '0' : ''}${s}.${ms}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-medium mb-2">
            <Film className="w-3.5 h-3.5" />
            Video Timeline Studio
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
            Timeline Video Trimmer & Overlay
          </h1>
          <p className="text-sm text-slate-400">
            Trim video duration, overlay customized graphic typography captions, and configure playback rates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="cursor-pointer">
            <Button variant="outline" size="sm" icon={<Upload className="w-4 h-4" />}>
              Import Video
              <input type="file" accept="video/*" onChange={handleFileUpload} className="hidden" />
            </Button>
          </label>
          <Button
            variant="primary"
            size="sm"
            icon={<Save className="w-4 h-4" />}
            loading={isExporting}
            onClick={handleExport}
          >
            {isExporting ? 'Exporting Timeline...' : 'Export & Save Clip'}
          </Button>
        </div>
      </div>

      {saveSuccess && (
        <div className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{saveSuccess}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Video Preview and Timeline */}
        <div className="lg:col-span-8 space-y-6">
          <GlassCard className="p-4 sm:p-6 overflow-hidden bg-dark-950/80">
            {/* Video Viewport Container with Live Text Overlay */}
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-slate-800 shadow-2xl">
              <video
                ref={videoRef}
                src={videoSrc}
                muted={isMuted}
                className="w-full h-full object-contain"
                onClick={togglePlay}
              />

              {/* Dynamic Live Text Overlay */}
              {overlayText && (
                <div
                  style={{
                    color: textColor,
                    fontSize: `${textSize}px`,
                  }}
                  className={`absolute pointer-events-none font-bold tracking-wider px-6 text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] transition-all font-['Space_Grotesk'] ${
                    textPosition === 'top'
                      ? 'top-6'
                      : textPosition === 'center'
                      ? 'top-1/2 -translate-y-1/2'
                      : 'bottom-6'
                  }`}
                >
                  {overlayText}
                </div>
              )}

              {/* Center Play Button Overlay when Paused */}
              {!isPlaying && (
                <button
                  onClick={togglePlay}
                  className="absolute w-16 h-16 rounded-full bg-electric-600/80 backdrop-blur-sm flex items-center justify-center text-white shadow-glow-blue hover:scale-105 transition-transform"
                >
                  <Play className="w-7 h-7 fill-white ml-1" />
                </button>
              )}
            </div>

            {/* Timeline Transport Bar */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-2 rounded-xl bg-dark-900 border border-slate-800 text-white hover:text-electric-400 transition"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-xl bg-dark-900 border border-slate-800 text-white hover:text-electric-400 transition"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <span className="font-mono text-white">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                {/* Speed Controls */}
                <div className="flex items-center gap-1 bg-dark-900 p-1 rounded-xl border border-slate-800">
                  <Gauge className="w-3.5 h-3.5 text-slate-500 ml-1" />
                  {[0.5, 1, 1.5, 2].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handleRateChange(rate)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition ${
                        playbackRate === rate ? 'bg-electric-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Timeline Scrubber & Trim Markers */}
              <div className="p-4 rounded-xl bg-dark-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5 text-pink-400" /> Trim Bounds
                  </span>
                  <span className="font-mono text-electric-400">
                    Selected Duration: {(trimEnd - trimStart).toFixed(1)}s
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                      Start Time: <span className="text-white font-mono">{formatTime(trimStart)}</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max={trimEnd - 0.5}
                      step="0.1"
                      value={trimStart}
                      onChange={(e) => setTrimStart(Number(e.target.value))}
                      className="w-full accent-pink-500 bg-slate-800 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                      End Time: <span className="text-white font-mono">{formatTime(trimEnd)}</span>
                    </label>
                    <input
                      type="range"
                      min={trimStart + 0.5}
                      max={duration}
                      step="0.1"
                      value={trimEnd}
                      onChange={(e) => setTrimEnd(Number(e.target.value))}
                      className="w-full accent-pink-500 bg-slate-800 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Overlay Controls */}
        <div className="lg:col-span-4 space-y-6">
          <GlassCard className="p-6 space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Type className="w-4 h-4 text-electric-400" /> Text Overlay Stamping
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Caption Text</label>
                  <input
                    type="text"
                    value={overlayText}
                    onChange={(e) => setOverlayText(e.target.value)}
                    placeholder="Enter banner or title text..."
                    className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-electric-500"
                  />
                </div>

                {/* Font Size Slider */}
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Font Size</span>
                    <span className="font-mono text-white">{textSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="14"
                    max="64"
                    value={textSize}
                    onChange={(e) => setTextSize(Number(e.target.value))}
                    className="w-full accent-electric-500 bg-slate-800 rounded-lg"
                  />
                </div>

                {/* Text Color Picker */}
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Text Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-9 h-9 rounded-lg bg-transparent cursor-pointer border border-slate-700 p-0.5"
                    />
                    <span className="font-mono text-xs text-slate-300 uppercase">{textColor}</span>
                  </div>
                </div>

                {/* Overlay Position */}
                <div>
                  <label className="block text-xs text-slate-400 mb-2">Vertical Position</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['top', 'center', 'bottom'] as const).map((pos) => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => setTextPosition(pos)}
                        className={`py-1.5 rounded-lg text-xs font-semibold uppercase border transition ${
                          textPosition === pos
                            ? 'bg-electric-600/20 border-electric-500 text-white'
                            : 'bg-dark-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Clip Export Button */}
            <div className="pt-2 border-t border-slate-800">
              <Button
                variant="primary"
                className="w-full bg-gradient-to-r from-pink-600 to-violet-600 shadow-glow-violet"
                loading={isExporting}
                onClick={handleExport}
                icon={<Download className="w-4 h-4" />}
              >
                Render & Export Clip
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
