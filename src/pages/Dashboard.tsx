import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuota } from '../context/QuotaContext';
import { mockStorage } from '../lib/mockStorage';
import { MediaAsset, GenerationJob } from '../types';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { StatusBadge } from '../components/StatusBadge';
import { MediaViewerModal } from '../components/MediaViewerModal';
import {
  Wand2,
  Video,
  Crop,
  Film,
  FolderHeart,
  History,
  Coins,
  HardDrive,
  Sparkles,
  ArrowRight,
  Plus
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { imageCredits, videoCredits } = useQuota();

  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [jobs, setJobs] = useState<GenerationJob[]>([]);
  const [activeAsset, setActiveAsset] = useState<MediaAsset | null>(null);

  useEffect(() => {
    setAssets(mockStorage.getAssets());
    setJobs(mockStorage.getJobs());
  }, []);

  const totalStorageBytes = assets.reduce((acc, curr) => acc + (curr.file_size || 0), 0);
  const totalStorageMB = (totalStorageBytes / (1024 * 1024)).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
            Welcome Back, {user?.display_name || 'Creator'} 👋
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Flow AI Studio creative control center. Monitor credits, jump into tools, and manage your cloud library.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/image-generator">
            <Button icon={<Plus className="w-4 h-4" />}>New Image</Button>
          </Link>
          <Link to="/video-generator">
            <Button variant="secondary" icon={<Video className="w-4 h-4 text-violet-400" />}>New Video</Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <GlassCard glow="blue" className="p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Image Credits</span>
            <Coins className="w-4 h-4 text-electric-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{imageCredits}</div>
          <div className="text-[11px] text-slate-500 mt-2">DALL-E 3 & SDXL Available</div>
        </GlassCard>

        <GlassCard glow="violet" className="p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Video Credits</span>
            <Video className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{videoCredits}</div>
          <div className="text-[11px] text-slate-500 mt-2">Runway Gen-2 & SVD Available</div>
        </GlassCard>

        <GlassCard glow="cyan" className="p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Saved Creations</span>
            <FolderHeart className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{assets.length}</div>
          <div className="text-[11px] text-slate-500 mt-2">Across Image & Video Studios</div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Cloud Storage Used</span>
            <HardDrive className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{totalStorageMB} MB</div>
          <div className="text-[11px] text-slate-500 mt-2">Private Supabase Bucket</div>
        </GlassCard>
      </div>

      {/* Quick Launch Workspaces Grid */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 font-['Space_Grotesk']">
          Creative Workspaces
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Link to="/image-generator" className="group">
            <GlassCard glow="blue" className="p-5 h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-electric-500/10 text-electric-400 border border-electric-500/20 flex items-center justify-center mb-3">
                  <Wand2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">AI Image Studio</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Generate 8k concept art, photorealistic portraits, and banners from text prompts.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-electric-400 group-hover:translate-x-1 transition-transform">
                Open Studio <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </GlassCard>
          </Link>

          <Link to="/video-generator" className="group">
            <GlassCard glow="violet" className="p-5 h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center mb-3">
                  <Video className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">AI Video Generator</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Synthesize cinematic camera motions and animate static photography with AI.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-violet-400 group-hover:translate-x-1 transition-transform">
                Open Video AI <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </GlassCard>
          </Link>

          <Link to="/photo-editor" className="group">
            <GlassCard glow="cyan" className="p-5 h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mb-3">
                  <Crop className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">Canvas Photo Editor</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time browser canvas pixel filter adjustments, rotation, cropping, and export.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
                Open Photo Canvas <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </GlassCard>
          </Link>

          <Link to="/video-editor" className="group">
            <GlassCard glow="none" className="p-5 h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center justify-center mb-3">
                  <Film className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">Video Timeline Trimmer</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Trim timestamps, apply customizable graphic text overlays, and export clips.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-pink-400 group-hover:translate-x-1 transition-transform">
                Open Video Editor <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </GlassCard>
          </Link>
        </div>
      </div>

      {/* Recent Creations Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 font-['Space_Grotesk']">
            <FolderHeart className="w-5 h-5 text-electric-400" />
            Recent Creations
          </h2>
          <Link to="/my-creations" className="text-xs font-semibold text-electric-400 hover:text-electric-300">
            View All ({assets.length})
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {assets.slice(0, 4).map((asset) => (
            <GlassCard
              key={asset.id}
              className="p-3 group cursor-pointer overflow-hidden flex flex-col justify-between"
              onClick={() => setActiveAsset(asset)}
            >
              <div className="relative h-44 rounded-xl overflow-hidden mb-2 bg-dark-950">
                {asset.asset_type === 'image' ? (
                  <img
                    src={asset.public_url}
                    alt={asset.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <video
                    src={asset.public_url}
                    className="w-full h-full object-cover"
                    muted
                  />
                )}
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-dark-950/80 backdrop-blur border border-slate-700 text-slate-300 uppercase">
                  {asset.asset_type}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white truncate">{asset.title}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {new Date(asset.created_at).toLocaleDateString()}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      <MediaViewerModal
        asset={activeAsset}
        onClose={() => setActiveAsset(null)}
      />
    </div>
  );
};
