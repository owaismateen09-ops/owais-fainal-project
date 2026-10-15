import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { Sparkles, Code2, Database, Shield, Cpu, ExternalLink } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-500/10 border border-electric-500/20 text-electric-400 text-xs font-medium mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Final Project Documentation
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 font-['Space_Grotesk']">
          About Flow AI Studio
        </h1>
        <p className="text-slate-400 text-base leading-relaxed">
          Designed and developed by <strong className="text-white">Owais</strong> as a production-grade Final Year Capstone Project, demonstrating end-to-end full-stack web engineering, cloud security, and generative AI integration.
        </p>
      </div>

      {/* Project Vision & Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard glow="blue" className="p-6">
          <div className="w-10 h-10 rounded-xl bg-electric-500/10 text-electric-400 border border-electric-500/20 flex items-center justify-center mb-4">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Unified Creative Workspace</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Eliminating workflow friction by bundling image generation, video synthesis, canvas photo adjustments, and timeline video trimming into a single sign-on experience.
          </p>
        </GlassCard>

        <GlassCard glow="violet" className="p-6">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center mb-4">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">PostgreSQL Integrity</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Built on a normalized 10-table relational model on Supabase PostgreSQL with strict Row Level Security (RLS) policies and atomic credit transactions.
          </p>
        </GlassCard>

        <GlassCard glow="cyan" className="p-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mb-4">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Honest Provider Architecture</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Never faking results or pretending an AI output succeeded when an API key is missing. Clearly informing users of real provider states and instructions.
          </p>
        </GlassCard>
      </div>

      {/* Student Author & Tech Stack */}
      <GlassCard className="p-8 sm:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 font-['Space_Grotesk']">
              Developer Profile & Credits
            </h2>
            <div className="space-y-3 text-sm text-slate-300">
              <p>
                <strong className="text-white">Lead Engineer:</strong> Owais
              </p>
              <p>
                <strong className="text-white">Project Scope:</strong> Production-Oriented Multi-Model AI Creative SaaS Platform
              </p>
              <p>
                <strong className="text-white">Target Deployment:</strong> Netlify (Frontend) + Supabase (Database, Auth, Storage, Edge Functions)
              </p>
              <p className="text-xs text-slate-400 leading-relaxed pt-2">
                This project was created with rigorous attention to engineering quality, accessibility guidelines, responsive dark-mode aesthetics, and truthful system reporting.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-dark-950/80 border border-slate-800 space-y-4">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Project Artifacts & Source Docs
            </h4>
            <div className="space-y-2 text-xs">
              <a
                href="/docs/FINAL_PROJECT_REPORT.md"
                target="_blank"
                className="flex items-center justify-between p-2.5 rounded-xl bg-dark-900 border border-slate-800 hover:border-electric-500 text-slate-300 hover:text-white transition"
              >
                <span>Final Academic Report (16 Sections)</span>
                <ExternalLink className="w-3.5 h-3.5 text-electric-400" />
              </a>
              <a
                href="/docs/ERD.md"
                target="_blank"
                className="flex items-center justify-between p-2.5 rounded-xl bg-dark-900 border border-slate-800 hover:border-violet-500 text-slate-300 hover:text-white transition"
              >
                <span>Entity Relationship Diagram (Mermaid)</span>
                <ExternalLink className="w-3.5 h-3.5 text-violet-400" />
              </a>
              <a
                href="/docs/PRESENTATION.md"
                target="_blank"
                className="flex items-center justify-between p-2.5 rounded-xl bg-dark-900 border border-slate-800 hover:border-cyan-500 text-slate-300 hover:text-white transition"
              >
                <span>Final 10-Slide Presentation Deck</span>
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              </a>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
