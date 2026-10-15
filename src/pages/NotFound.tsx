import React from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { Sparkles, Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <GlassCard className="p-8 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-electric-500/10 border border-electric-500/20 text-electric-400 flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-white font-['Space_Grotesk']">
          404 — Page Not Found
        </h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          The requested studio resource or route could not be found.
        </p>
        <div className="pt-4">
          <Link to="/">
            <Button size="sm" icon={<Home className="w-4 h-4" />}>
              Back to Home
            </Button>
          </Link>
        </div>
      </GlassCard>
    </div>
  );
};
