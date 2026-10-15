import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import { Check, Sparkles, Zap, Shield, HelpCircle } from 'lucide-react';

export const Pricing: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Pricing Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-500/10 border border-electric-500/20 text-electric-400 text-xs font-medium mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Transparent Credit Ledger
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 font-['Space_Grotesk']">
          Fair, Predictable Quotas
        </h1>
        <p className="text-slate-400 text-base leading-relaxed">
          Every new creator gets complimentary starter credits on registration. No credit card required.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Plan 1: Free Starter (Active Plan) */}
        <GlassCard glow="blue" className="p-8 flex flex-col justify-between border-electric-500/50 relative">
          <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-electric-500/20 text-electric-400 border border-electric-500/30 text-[10px] font-bold uppercase tracking-wider">
            Current Tier
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Creator Free Starter</h3>
            <p className="text-xs text-slate-400 mb-6">
              Complimentary quota provided upon registration for testing and student projects.
            </p>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-extrabold text-white font-mono">$0</span>
              <span className="text-xs text-slate-400">/ forever</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <strong className="text-white">20 AI Image Credits</strong> (DALL-E 3 / SDXL)
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <strong className="text-white">3 AI Video Credits</strong> (Runway Gen-2 / SVD)
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <strong>Unlimited Canvas Photo Edits</strong>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <strong>Unlimited Video Timeline Trims</strong>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400" />
                Private Supabase Cloud Storage
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400" />
                Standard Resolution Export (PNG / MP4)
              </li>
            </ul>
          </div>

          <div className="mt-8">
            <Link to="/signup">
              <Button size="lg" className="w-full">
                Get Started Free
              </Button>
            </Link>
          </div>
        </GlassCard>

        {/* Plan 2: Pro Creator (Roadmap / Future) */}
        <GlassCard className="p-8 flex flex-col justify-between opacity-80 hover:opacity-100 transition-opacity">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-white">Pro Creator</h3>
              <span className="text-[10px] uppercase font-semibold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">
                Future Expansion
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              High-volume creative capacity for daily social media and production workflows.
            </p>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-extrabold text-white font-mono">$19</span>
              <span className="text-xs text-slate-400">/ month</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-violet-400" />
                <strong>300 AI Image Credits</strong> / month
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-violet-400" />
                <strong>50 AI Video Credits</strong> / month
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-violet-400" />
                Priority GPU Dispatch Queue
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-violet-400" />
                High-Resolution 4K Image Upscaling
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-violet-400" />
                25 GB Dedicated Cloud Asset Vault
              </li>
            </ul>
          </div>

          <div className="mt-8">
            <Button variant="secondary" size="lg" className="w-full" disabled>
              Coming Soon in v2.0
            </Button>
          </div>
        </GlassCard>

        {/* Plan 3: Studio Enterprise */}
        <GlassCard className="p-8 flex flex-col justify-between opacity-80 hover:opacity-100 transition-opacity">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-white">Studio Enterprise</h3>
              <span className="text-[10px] uppercase font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                Custom
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Dedicated model endpoints, custom fine-tunes, and organization workspace roles.
            </p>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-extrabold text-white font-mono">$99</span>
              <span className="text-xs text-slate-400">/ month</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-cyan-400" />
                <strong>Unlimited Image & Video Credits</strong>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-cyan-400" />
                Dedicated Cloud GPU Cluster
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-cyan-400" />
                Custom LoRA Fine-Tuning Integration
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-cyan-400" />
                Multi-User Shared Team Workspace
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-cyan-400" />
                99.9% Uptime Service Level Agreement
              </li>
            </ul>
          </div>

          <div className="mt-8">
            <Link to="/contact">
              <Button variant="outline" size="lg" className="w-full">
                Contact for Enterprise
              </Button>
            </Link>
          </div>
        </GlassCard>
      </div>

      {/* Credit Consumption Breakdown Table */}
      <GlassCard className="p-8">
        <h3 className="text-xl font-bold text-white mb-2 font-['Space_Grotesk']">
          Credit Consumption Rules
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Credits are reserved atomically at the time of job initiation and automatically refunded if a provider experiences downtime.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Operation</th>
                <th className="py-3 px-4">Supported Engine</th>
                <th className="py-3 px-4">Credit Deduction</th>
                <th className="py-3 px-4">Refund Policy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-3 px-4 font-semibold text-white">AI Image Generation</td>
                <td className="py-3 px-4">OpenAI DALL-E 3 / Stability SDXL</td>
                <td className="py-3 px-4 font-mono text-electric-400">1 Image Credit</td>
                <td className="py-3 px-4 text-emerald-400">Auto-refund on 4xx/5xx failure</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">AI Video Synthesis</td>
                <td className="py-3 px-4">Runway Gen-2 / Replicate SVD</td>
                <td className="py-3 px-4 font-mono text-violet-400">1 Video Credit</td>
                <td className="py-3 px-4 text-emerald-400">Auto-refund on job failure</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Canvas Photo Editing</td>
                <td className="py-3 px-4">In-Browser HTML5 Canvas</td>
                <td className="py-3 px-4 font-mono text-emerald-400">0 Credits (Free)</td>
                <td className="py-3 px-4 text-slate-500">N/A (Client-side)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Video Timeline Trimming</td>
                <td className="py-3 px-4">In-Browser HTML5 Video MediaEngine</td>
                <td className="py-3 px-4 font-mono text-emerald-400">0 Credits (Free)</td>
                <td className="py-3 px-4 text-slate-500">N/A (Client-side)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
