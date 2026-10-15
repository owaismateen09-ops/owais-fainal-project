import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { FileText } from 'lucide-react';

export const TermsOfService: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="text-center">
        <FileText className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
        <h1 className="text-3xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-400 mt-1">Acceptable Use & Academic SaaS Terms</p>
      </div>

      <GlassCard className="p-8 sm:p-12 space-y-6 text-sm text-slate-300 leading-relaxed">
        <div>
          <h2 className="text-lg font-bold text-white mb-2">1. Acceptable Content Generation</h2>
          <p className="text-slate-400 text-xs leading-relaxed">
            Users must not generate illicit, infringing, defamatory, or harmful imagery or video. Prompts that violate OpenAI, Stability AI, or Runway acceptable use guidelines will be rejected by upstream provider filters.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-white mb-2">2. Quota & Credit Ledger</h2>
          <p className="text-slate-400 text-xs leading-relaxed">
            New users are granted 20 image generation credits and 3 video generation credits upon signup. Credits are deducted atomically upon job initiation. If an upstream provider fails to fulfill a job, credits are automatically refunded to the user ledger.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-white mb-2">3. Academic & Demonstration Notice</h2>
          <p className="text-slate-400 text-xs leading-relaxed">
            Flow AI Studio is built as a final project capstone. While production-grade architecture and security are implemented, commercial payment processing is reserved for Version 2.
          </p>
        </div>
      </GlassCard>
    </div>
  );
};
