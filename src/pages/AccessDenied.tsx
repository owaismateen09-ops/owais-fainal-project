import React from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { ShieldX, ArrowLeft } from 'lucide-react';

export const AccessDenied: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <GlassCard className="p-8 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <ShieldX className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-white font-['Space_Grotesk']">
          403 — Access Denied
        </h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          You do not have the required administrative role to view this section. Role verification is enforced by PostgreSQL Row Level Security.
        </p>
        <div className="pt-4">
          <Link to="/dashboard">
            <Button size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
              Return to User Dashboard
            </Button>
          </Link>
        </div>
      </GlassCard>
    </div>
  );
};
