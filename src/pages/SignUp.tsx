import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { Sparkles, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';

export const SignUp: React.FC = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setErrorNotice('Password must contain at least 6 characters.');
      return;
    }

    setErrorNotice(null);
    setLoading(true);

    const res = await signUp(email, password, fullName);
    setLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setErrorNotice(res.error || 'Failed to complete registration.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-electric-600 to-violet-600 flex items-center justify-center p-0.5 mx-auto mb-4 shadow-glow-blue">
          <div className="w-full h-full bg-dark-950 rounded-[14px] flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-electric-400" />
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
          Join Flow AI Studio
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Instant access with 20 complimentary image & 3 video generation credits
        </p>
      </div>

      <GlassCard className="p-8 space-y-6">
        {/* Starter Quota Highlights */}
        <div className="p-3 rounded-xl bg-electric-500/10 border border-electric-500/20 text-xs text-electric-300 space-y-1">
          <div className="font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Instant Free Tier Included:
          </div>
          <div className="text-[11px] text-slate-400 pl-5">
            • 20 AI Image Credits • 3 AI Video Credits • Unlimited Canvas
          </div>
        </div>

        {errorNotice && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorNotice}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Owais Creator"
                required
                className="w-full bg-dark-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-electric-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                required
                className="w-full bg-dark-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-electric-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password (6+ characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-dark-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-electric-500"
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full" loading={loading}>
            Create Account & Claim Credits
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-electric-400 font-semibold hover:text-electric-300">
            Sign In
          </Link>
        </div>
      </GlassCard>
    </div>
  );
};
