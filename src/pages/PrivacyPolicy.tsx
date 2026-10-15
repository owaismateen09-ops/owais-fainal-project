import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="text-center">
        <ShieldCheck className="w-10 h-10 text-electric-400 mx-auto mb-3" />
        <h1 className="text-3xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-400 mt-1">Last updated: October 2026</p>
      </div>

      <GlassCard className="p-8 sm:p-12 space-y-6 text-sm text-slate-300 leading-relaxed">
        <div>
          <h2 className="text-lg font-bold text-white mb-2">1. Data Storage & Multi-Tenancy</h2>
          <p className="text-slate-400 text-xs leading-relaxed">
            Flow AI Studio uses Supabase PostgreSQL with strict Row Level Security (RLS). All user accounts, generation histories, and uploaded source media assets remain isolated in private buckets and are only accessible by the verified user account.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-white mb-2">2. AI Provider Integrations</h2>
          <p className="text-slate-400 text-xs leading-relaxed">
            When you initiate an AI generation job, your prompt and selected parameters are routed server-side to the chosen provider (OpenAI, Stability AI, Runway, or Replicate). API credentials never touch the client application.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-white mb-2">3. Local In-Browser Processing</h2>
          <p className="text-slate-400 text-xs leading-relaxed">
            Edits made in the Photo Editor and Video Editor are computed inside your local browser canvas and media engines, guaranteeing total privacy for editing tasks until you choose to save or export.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-white mb-2">4. Deletion Rights</h2>
          <p className="text-slate-400 text-xs leading-relaxed">
            You retain 100% ownership of your creative assets. You may delete any image, video, or generation job record from the My Creations interface at any time.
          </p>
        </div>
      </GlassCard>
    </div>
  );
};
