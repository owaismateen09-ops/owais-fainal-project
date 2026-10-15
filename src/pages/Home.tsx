import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { GlassCard } from '../components/GlassCard';
import {
  Sparkles,
  Wand2,
  Video,
  Crop,
  Film,
  Shield,
  Zap,
  ArrowRight,
  Layers,
  CheckCircle2,
  Play
} from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-hero-gradient pointer-events-none -z-10" />
      <div className="absolute top-[30%] -left-40 w-96 h-96 bg-electric-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[40%] -right-40 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Release Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-electric-500/10 border border-electric-500/20 text-electric-400 text-xs font-medium mb-8 backdrop-blur-md animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation Multi-Model Creative SaaS Suite</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight mb-6 font-['Space_Grotesk']">
          Generate, Animate & Edit <br />
          <span className="bg-gradient-to-r from-electric-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Without Creative Limits
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Flow AI Studio brings multi-model Image Generation, Video Synthesis, Canvas Photo Editing, and Video Timeline Trimming into a single high-performance workspace.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link to="/image-generator">
            <Button size="lg" icon={<Wand2 className="w-5 h-5" />}>
              Open AI Image Studio
            </Button>
          </Link>
          <Link to="/video-generator">
            <Button size="lg" variant="secondary" icon={<Video className="w-5 h-5 text-violet-400" />}>
              Try Video Synthesis
            </Button>
          </Link>
          <Link to="/photo-editor">
            <Button size="lg" variant="outline" icon={<Crop className="w-5 h-5 text-cyan-400" />}>
              Open Photo Editor
            </Button>
          </Link>
        </div>

        {/* Free Credits Callout Banner */}
        <div className="inline-flex items-center gap-6 px-6 py-3 rounded-2xl bg-dark-900/80 border border-slate-800 text-xs text-slate-300 backdrop-blur-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>20 Free Image Credits</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>3 Free Video Credits</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Full Canvas Suite Included</span>
          </div>
        </div>
      </section>

      {/* Floating Showcase Cards Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: AI Image Studio */}
          <GlassCard glow="blue" className="p-6 overflow-hidden group">
            <div className="h-52 rounded-xl overflow-hidden mb-5 relative">
              <img
                src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80"
                alt="AI Image Generator Showcase"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-dark-950/80 backdrop-blur text-[11px] font-semibold text-electric-400 border border-electric-500/30">
                Text to Image
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-electric-400" />
              AI Image Studio
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Synthesize 8K imagery with style presets, customizable aspect ratios (1:1, 16:9, 9:16, 4:3), and negative prompt controls.
            </p>
            <Link to="/image-generator" className="inline-flex items-center text-sm font-semibold text-electric-400 hover:text-electric-300 gap-1.5">
              Launch Studio <ArrowRight className="w-4 h-4" />
            </Link>
          </GlassCard>

          {/* Card 2: AI Video Generator */}
          <GlassCard glow="violet" className="p-6 overflow-hidden group">
            <div className="h-52 rounded-xl overflow-hidden mb-5 relative">
              <img
                src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80"
                alt="AI Video Generator Showcase"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-dark-950/80 backdrop-blur text-[11px] font-semibold text-violet-400 border border-violet-500/30">
                Text & Image to Video
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-violet-600/80 backdrop-blur-sm flex items-center justify-center text-white shadow-glow-violet group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Video className="w-5 h-5 text-violet-400" />
              AI Video Synthesis
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Generate cinematic motion from text prompts or transform static photography into fluid animations with motion strength tuning.
            </p>
            <Link to="/video-generator" className="inline-flex items-center text-sm font-semibold text-violet-400 hover:text-violet-300 gap-1.5">
              Generate Video <ArrowRight className="w-4 h-4" />
            </Link>
          </GlassCard>

          {/* Card 3: Photo & Video Canvas Editors */}
          <GlassCard glow="cyan" className="p-6 overflow-hidden group">
            <div className="h-52 rounded-xl overflow-hidden mb-5 relative">
              <img
                src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80"
                alt="Photo and Video Editor Showcase"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-dark-950/80 backdrop-blur text-[11px] font-semibold text-cyan-400 border border-cyan-500/30">
                In-Browser Canvas
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Crop className="w-5 h-5 text-cyan-400" />
              Creative Editing Suites
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Non-destructive canvas photo filters, aspect crop, rotation, alongside video timeline trimming and text overlay stamping.
            </p>
            <Link to="/photo-editor" className="inline-flex items-center text-sm font-semibold text-cyan-400 hover:text-cyan-300 gap-1.5">
              Open Canvas <ArrowRight className="w-4 h-4" />
            </Link>
          </GlassCard>
        </div>
      </section>

      {/* Feature Matrix / Highlights */}
      <section className="border-t border-slate-800/80 bg-dark-900/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-['Space_Grotesk']">
              Engineered with Enterprise Discipline
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Every creation, edit, transaction, and permission check is backed by resilient cloud architecture and strict PostgreSQL Row Level Security.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-dark-950/60 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-electric-500/10 text-electric-400 border border-electric-500/20 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white mb-2">Atomic Quota Ledger</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Transactions are recorded with idempotency keys and row locking, preventing double deductions and race conditions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-dark-950/60 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white mb-2">Supabase PostgreSQL RLS</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Database-level policies ensure users only read and mutate their own assets. Roles cannot be elevated from browser state.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-dark-950/60 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white mb-2">Client-Side Canvas</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zero-lag interactive image filtering, aspect-ratio cropping, and video trimming execute directly in-browser.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-dark-950/60 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white mb-2">Multi-Tier Administration</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dedicated Admin and Super Admin hubs for monitoring job queues, inspecting error codes, and reviewing audit logs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <GlassCard glow="blue" className="p-10 md:p-14 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-electric-500/20 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 font-['Space_Grotesk']">
            Ready to Unleash Your Imagination?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-8 font-light">
            Start generating images and video clips today with 20 complimentary image credits and 3 video generation credits.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" icon={<Sparkles className="w-5 h-5" />}>
                Create Free Account
              </Button>
            </Link>
            <Link to="/features">
              <Button size="lg" variant="secondary">
                View Full Specifications
              </Button>
            </Link>
          </div>
        </GlassCard>
      </section>
    </div>
  );
};
