import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuota } from '../context/QuotaContext';
import { videoProvider } from '../lib/aiProviders';
import { mockStorage } from '../lib/mockStorage';
import { MediaAsset, GenerationJob } from '../types';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { MediaViewerModal } from '../components/MediaViewerModal';
import { StatusBadge } from '../components/StatusBadge';
import {
  Video,
  Upload,
  Play,
  Film,
  Sparkles,
  AlertCircle,
  Download,
  Trash2,
  Maximize2,
  Clock,
  Sliders,
  Check
} from 'lucide-react';

export const VideoGenerator: React.FC = () => {
  const { user } = useAuth();
  const { videoCredits, useVideoCredit } = useQuota();

  const [mode, setMode] = useState<'text_to_video' | 'image_to_video'>('text_to_video');
  const [prompt, setPrompt] = useState('');
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [duration, setDuration] = useState('5s');
  const [motionStrength, setMotionStrength] = useState<number>(5);

  const [generating, setGenerating] = useState(false);
  const [currentJob, setCurrentJob] = useState<GenerationJob | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [missingEnv, setMissingEnv] = useState<string | null>(null);

  const [videoGallery, setVideoGallery] = useState<MediaAsset[]>(() => {
    return mockStorage.getAssets().filter(a => a.asset_type === 'video');
  });

  const [activeAsset, setActiveAsset] = useState<MediaAsset | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorNotice('Image file exceeds maximum allowable size (10MB).');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setSourceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (mode === 'text_to_video' && !prompt.trim()) {
      setErrorNotice('Please provide a prompt describing the scene and camera motion.');
      return;
    }
    if (mode === 'image_to_video' && !sourceImage) {
      setErrorNotice('Please upload a source image to animate.');
      return;
    }

    if (videoCredits < 1) {
      setErrorNotice('Insufficient video credits. You have 0 credits remaining.');
      return;
    }

    setErrorNotice(null);
    setMissingEnv(null);
    setGenerating(true);

    const jobId = 'vjob_' + Date.now();
    const newJob: GenerationJob = {
      id: jobId,
      owner_id: user?.user_id || 'demo-user',
      job_type: mode,
      provider: 'runway',
      model: 'gen-2',
      prompt: prompt || 'Image animation',
      parameters: { duration, motion_strength: motionStrength },
      status: 'processing',
      credit_cost: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setCurrentJob(newJob);
    mockStorage.saveJob(newJob);

    // Deduct credit atomically
    const deductRes = await useVideoCredit(1, `AI Video: "${(prompt || 'Animation').slice(0, 30)}"`);
    if (!deductRes.success) {
      setErrorNotice(deductRes.error || 'Failed to deduct video credit.');
      setGenerating(false);
      setCurrentJob(null);
      return;
    }

    // Call real provider adapter
    const response = await videoProvider.generateVideo({
      prompt: prompt.trim(),
      source_image_url: sourceImage || undefined,
      duration,
      motion_strength: motionStrength
    });

    if (!response.success) {
      setErrorNotice(response.error || 'Video generation service failed.');
      if (response.missingConfig) {
        setMissingEnv(response.missingConfig);
      }

      const failedJob: GenerationJob = {
        ...newJob,
        status: 'failed',
        error_code: response.missingConfig ? 'CONFIG_MISSING' : 'PROVIDER_ERROR',
        error_message: response.error,
        updated_at: new Date().toISOString()
      };
      setCurrentJob(failedJob);
      mockStorage.saveJob(failedJob);
      setGenerating(false);
      return;
    }

    const completedJob: GenerationJob = {
      ...newJob,
      status: 'completed',
      result_asset_url: response.assetUrl,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setCurrentJob(completedJob);
    mockStorage.saveJob(completedJob);

    if (response.assetUrl) {
      const asset: MediaAsset = {
        id: 'vasset_' + Date.now(),
        owner_id: user?.user_id || 'demo-user',
        source_job_id: jobId,
        asset_type: 'video',
        storage_path: `user-assets/${jobId}.mp4`,
        public_url: response.assetUrl,
        mime_type: 'video/mp4',
        file_size: 15400000,
        title: prompt.slice(0, 40) || 'Synthesized Video Clip',
        prompt,
        created_at: new Date().toISOString(),
        tags: [duration, `Motion ${motionStrength}`]
      };
      mockStorage.saveAsset(asset);
      setVideoGallery(prev => [asset, ...prev]);
    }

    setGenerating(false);
  };

  const handleDelete = (id: string) => {
    mockStorage.deleteAsset(id);
    setVideoGallery(prev => prev.filter(a => a.id !== id));
  };

  const handleRename = (id: string, newTitle: string) => {
    mockStorage.renameAsset(id, newTitle);
    setVideoGallery(prev => prev.map(a => a.id === id ? { ...a, title: newTitle } : a));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium mb-2">
            <Video className="w-3.5 h-3.5" />
            AI Video Synthesis
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
            Motion Generation & Animation
          </h1>
          <p className="text-sm text-slate-400">
            Synthesize video sequences from descriptive text or upload existing images to animate fluid camera trajectories.
          </p>
        </div>

        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-dark-900 border border-slate-800">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Remaining Quota</span>
            <span className="text-base font-bold text-white">{videoCredits} Video Credits</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center border border-violet-500/20">
            <Film className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard className="p-6 space-y-5">
            {/* Mode Switcher Tabs */}
            <div className="flex rounded-xl bg-dark-950 p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setMode('text_to_video')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                  mode === 'text_to_video'
                    ? 'bg-violet-600 text-white shadow-glow-violet'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Text-to-Video
              </button>
              <button
                type="button"
                onClick={() => setMode('image_to_video')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                  mode === 'image_to_video'
                    ? 'bg-violet-600 text-white shadow-glow-violet'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Image-to-Video
              </button>
            </div>

            {/* Image-to-Video Uploader */}
            {mode === 'image_to_video' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Upload Reference Image <span className="text-rose-400">*</span>
                </label>
                {sourceImage ? (
                  <div className="relative h-44 rounded-xl overflow-hidden border border-violet-500/40 group">
                    <img src={sourceImage} alt="Uploaded Source" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setSourceImage(null)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-rose-400 hover:text-rose-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-44 border-2 border-dashed border-slate-800 hover:border-violet-500/50 rounded-xl cursor-pointer bg-dark-950/60 transition">
                    <Upload className="w-7 h-7 text-violet-400 mb-2" />
                    <span className="text-xs font-semibold text-white">Click or drag source image</span>
                    <span className="text-[10px] text-slate-500 mt-1">PNG, JPG up to 10MB</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>
            )}

            {/* Prompt Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Prompt & Motion Details {mode === 'text_to_video' && <span className="text-rose-400">*</span>}
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                placeholder={
                  mode === 'text_to_video'
                    ? 'Cinematic slow-motion shot of a cybernetic tiger walking through rain-slicked futuristic alleys, dynamic tracking camera...'
                    : 'Add subtle camera pan to the left, glowing volumetric particles flowing through the air...'
                }
                className="w-full bg-dark-950 border border-slate-800 rounded-xl p-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 resize-none transition"
              />
            </div>

            {/* Motion Intensity Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                <span>Motion Intensity</span>
                <span className="text-violet-400 font-mono">{motionStrength} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={motionStrength}
                onChange={(e) => setMotionStrength(Number(e.target.value))}
                className="w-full accent-violet-500 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Subtle Drift</span>
                <span>Fast Action</span>
              </div>
            </div>

            {/* Duration Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-violet-400" /> Clip Duration
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['5s', '10s'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`py-2 text-xs font-semibold rounded-xl border transition ${
                      duration === d
                        ? 'bg-violet-600/20 border-violet-500 text-white'
                        : 'bg-dark-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {d} Standard
                  </button>
                ))}
              </div>
            </div>

            {/* Cost & Submit */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span>Operation Cost:</span>
                <span className="font-semibold text-white">1 Video Credit</span>
              </div>
              <Button
                size="lg"
                variant="primary"
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 shadow-glow-violet border-violet-400/30"
                loading={generating}
                onClick={handleGenerate}
                icon={<Video className="w-5 h-5" />}
              >
                {generating ? 'Synthesizing Video Clip...' : 'Generate Video'}
              </Button>
            </div>
          </GlassCard>

          {/* Missing Provider Credentials Banner */}
          {missingEnv && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                Live AI Video Provider Key Needed
              </div>
              <p className="text-amber-300/80 leading-relaxed">
                To run live video synthesis on Runway or Replicate GPUs, configure the server secret:
              </p>
              <code className="block bg-dark-950/80 p-2 rounded-lg text-[11px] text-amber-400 font-mono">
                supabase secrets set {missingEnv}=rw_...
              </code>
              <p className="text-[11px] text-slate-400">
                Check <a href="/docs/AI_PROVIDER_SETUP.md" className="underline text-violet-400">docs/AI_PROVIDER_SETUP.md</a> for detailed instructions.
              </p>
            </div>
          )}

          {errorNotice && !missingEnv && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorNotice}</span>
            </div>
          )}
        </div>

        {/* Gallery & Job Column */}
        <div className="lg:col-span-7 space-y-6">
          {currentJob && (
            <GlassCard className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Job ID:</span>
                  <code className="text-[11px] text-slate-300 font-mono">{currentJob.id}</code>
                </div>
                <StatusBadge status={currentJob.status} />
              </div>
              <p className="text-xs text-slate-300 italic mb-2">"{currentJob.prompt}"</p>
              <div className="text-[11px] text-slate-500 flex gap-4">
                <span>Model: {currentJob.model}</span>
                <span>Duration: {currentJob.parameters?.duration}</span>
                <span>Time: {new Date(currentJob.created_at).toLocaleTimeString()}</span>
              </div>
            </GlassCard>
          )}

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 font-['Space_Grotesk']">
                <Film className="w-4 h-4 text-violet-400" />
                Synthesized Video Gallery ({videoGallery.length})
              </h2>
              <span className="text-xs text-slate-500">Saved to My Creations</span>
            </div>

            {videoGallery.length === 0 ? (
              <GlassCard className="p-12 text-center">
                <div className="w-12 h-12 rounded-2xl bg-dark-800 text-slate-500 flex items-center justify-center mx-auto mb-4">
                  <Video className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1">No Videos Generated Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Enter a prompt or upload an image on the left to synthesize high-definition motion clips.
                </p>
              </GlassCard>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {videoGallery.map((asset) => (
                  <GlassCard
                    key={asset.id}
                    glow="violet"
                    className="p-3 group overflow-hidden flex flex-col justify-between"
                  >
                    <div className="relative h-56 rounded-xl overflow-hidden mb-3 bg-dark-950">
                      <video
                        src={asset.public_url}
                        className="w-full h-full object-cover cursor-pointer"
                        muted
                        loop
                        onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                        onMouseLeave={(e) => {
                          const v = e.target as HTMLVideoElement;
                          v.pause();
                          v.currentTime = 0;
                        }}
                        onClick={() => setActiveAsset(asset)}
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                        <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white">
                          <Play className="w-4 h-4 fill-white ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setActiveAsset(asset)}
                          className="p-1.5 rounded-lg bg-dark-950/80 backdrop-blur text-white hover:text-violet-400 border border-slate-700"
                          title="Full Preview"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={asset.public_url}
                          download={asset.title}
                          className="p-1.5 rounded-lg bg-dark-950/80 backdrop-blur text-white hover:text-emerald-400 border border-slate-700"
                          title="Download"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => handleDelete(asset.id)}
                          className="p-1.5 rounded-lg bg-dark-950/80 backdrop-blur text-white hover:text-rose-400 border border-slate-700"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white truncate mb-1">{asset.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-1 italic">{asset.prompt || 'Synthesized motion clip'}</p>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <MediaViewerModal
        asset={activeAsset}
        onClose={() => setActiveAsset(null)}
        onDelete={handleDelete}
        onRename={handleRename}
      />
    </div>
  );
};
