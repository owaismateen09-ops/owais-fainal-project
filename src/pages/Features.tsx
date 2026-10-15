import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import {
  Wand2,
  Video,
  Crop,
  Film,
  Shield,
  Zap,
  Database,
  Lock,
  Sliders,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const Features: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-500/10 border border-electric-500/20 text-electric-400 text-xs font-medium mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Technical Architecture & Features
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 font-['Space_Grotesk']">
          Every Feature Engineered for Production
        </h1>
        <p className="text-slate-400 text-base leading-relaxed">
          Flow AI Studio combines bleeding-edge generative AI models with real in-browser media editing capabilities, enforced by PostgreSQL security.
        </p>
      </div>

      {/* Feature Section 1: AI Image Generation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-24">
        <div>
          <div className="w-12 h-12 rounded-2xl bg-electric-500/10 text-electric-400 border border-electric-500/20 flex items-center justify-center mb-6">
            <Wand2 className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 font-['Space_Grotesk']">
            AI Image Studio (DALL-E 3 & SDXL)
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Generate stunning high-definition visual assets directly from plain text prompts. Customize composition with aspect ratio selections (1:1 Square, 16:9 Landscape, 9:16 Portrait, 4:3 Standard), style presets, and negative prompts.
          </p>
          <ul className="space-y-3 text-sm text-slate-300 mb-8">
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-electric-400"></span>
              Prompt presets for Cyberpunk, Cinematic, Photorealistic, Anime, and Minimalist.
            </li>
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-electric-400"></span>
              Atomic credit reservation: 1 credit per generation with automatic refund on errors.
            </li>
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-electric-400"></span>
              Full-size lightbox preview with instant download and direct save to My Creations.
            </li>
          </ul>
          <Link to="/image-generator">
            <Button icon={<Wand2 className="w-4 h-4" />}>Launch Image Studio</Button>
          </Link>
        </div>
        <GlassCard glow="blue" className="p-4 sm:p-6 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1000&q=80"
            alt="AI Image Studio UI Preview"
            className="w-full h-80 object-cover rounded-xl border border-slate-800"
          />
        </GlassCard>
      </div>

      {/* Feature Section 2: AI Video Generation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-24">
        <div className="order-2 lg:order-1">
          <GlassCard glow="violet" className="p-4 sm:p-6 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80"
              alt="AI Video Generator UI Preview"
              className="w-full h-80 object-cover rounded-xl border border-slate-800"
            />
          </GlassCard>
        </div>
        <div className="order-1 lg:order-2">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center mb-6">
            <Video className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 font-['Space_Grotesk']">
            AI Video Generation (Text & Image-to-Video)
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Bring scenes to life with fluid camera movements and realistic particle effects. Upload any reference image to transform static pictures into animated videos, or synthesize clips directly from text.
          </p>
          <ul className="space-y-3 text-sm text-slate-300 mb-8">
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
              Text-to-Video and Image-to-Video synthesis pipelines.
            </li>
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
              Motion strength adjustments and duration parameter options.
            </li>
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
              Asynchronous job tracking with persistent job ID and recovery upon tab reopen.
            </li>
          </ul>
          <Link to="/video-generator">
            <Button variant="secondary" icon={<Video className="w-4 h-4 text-violet-400" />}>
              Try Video Generator
            </Button>
          </Link>
        </div>
      </div>

      {/* Feature Section 3: Canvas Photo & Video Editors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-24">
        <div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mb-6">
            <Crop className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 font-['Space_Grotesk']">
            In-Browser Photo & Video Editing
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            No expensive third-party software needed. Fine-tune your AI generated creations with real non-destructive canvas adjustments, aspect-ratio cropping, rotation, video timeline trimming, and text overlays.
          </p>
          <ul className="space-y-3 text-sm text-slate-300 mb-8">
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              Brightness, contrast, saturation, blur, grayscale, and sepia canvas filters.
            </li>
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              HTML5 video trimmer with start/end markers and custom typography text overlays.
            </li>
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              Instant high-resolution PNG, JPEG, and MP4 downloads.
            </li>
          </ul>
          <div className="flex gap-4">
            <Link to="/photo-editor">
              <Button variant="outline" icon={<Crop className="w-4 h-4" />}>Photo Editor</Button>
            </Link>
            <Link to="/video-editor">
              <Button variant="outline" icon={<Film className="w-4 h-4" />}>Video Editor</Button>
            </Link>
          </div>
        </div>
        <GlassCard glow="cyan" className="p-4 sm:p-6 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80"
            alt="Editing Suite UI Preview"
            className="w-full h-80 object-cover rounded-xl border border-slate-800"
          />
        </GlassCard>
      </div>

      {/* Feature Section 4: Security & PostgreSQL Architecture */}
      <GlassCard className="p-8 sm:p-12 mb-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto mb-6">
            <Database className="w-6 h-6" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-['Space_Grotesk']">
            Database-Level Row Level Security (RLS)
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Unlike shallow prototypes that store sensitive data in browser state, Flow AI Studio defines 10 normalized PostgreSQL entities with PostgreSQL triggers, atomic stored procedures, and strict multi-tenant authorization policies.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="p-4 rounded-xl bg-dark-950/70 border border-slate-800">
              <Lock className="w-5 h-5 text-emerald-400 mb-2" />
              <h4 className="text-sm font-semibold text-white mb-1">Zero Client Elevation</h4>
              <p className="text-xs text-slate-400">Admin and Super Admin roles are verified server-side on each request.</p>
            </div>
            <div className="p-4 rounded-xl bg-dark-950/70 border border-slate-800">
              <Zap className="w-5 h-5 text-electric-400 mb-2" />
              <h4 className="text-sm font-semibold text-white mb-1">Atomic Balance Updates</h4>
              <p className="text-xs text-slate-400">PostgreSQL row locking prevents race condition overdrafts.</p>
            </div>
            <div className="p-4 rounded-xl bg-dark-950/70 border border-slate-800">
              <Shield className="w-5 h-5 text-violet-400 mb-2" />
              <h4 className="text-sm font-semibold text-white mb-1">Private Cloud Storage</h4>
              <p className="text-xs text-slate-400">Buckets enforce user ownership with signed time-limited tokens.</p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
