import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { Sparkles, Mail, Lock, AlertCircle, ArrowRight, ShieldCheck, User, ShieldAlert } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, isSandbox } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice(null);
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setErrorNotice(res.error || 'Failed to sign in. Please verify your credentials.');
    }
  };

  const quickDemoLogin = async (roleType: 'user' | 'admin' | 'superadmin') => {
    const demoEmail =
      roleType === 'superadmin'
        ? 'superadmin@flowai.studio'
        : roleType === 'admin'
        ? 'admin@flowai.studio'
        : 'creator@flowai.studio';

    setEmail(demoEmail);
    setPassword('DemoPass123!');
    setLoading(true);
    await login(demoEmail, 'DemoPass123!');
    setLoading(false);
    navigate('/dashboard');
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
          Sign In to Flow AI Studio
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Access your creative workspaces, history, and credit ledger
        </p>
      </div>

      <GlassCard className="p-8 space-y-6">
        {/* Quick Evaluator Sandbox Profiles */}
        {isSandbox && (
          <div className="p-3.5 rounded-xl bg-dark-950 border border-slate-800 space-y-2">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Evaluator 1-Click Quick Login
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => quickDemoLogin('user')}
                className="py-1.5 px-2 rounded-lg bg-electric-600/20 hover:bg-electric-600/30 text-electric-300 border border-electric-500/30 font-medium flex items-center justify-center gap-1 transition"
              >
                <User className="w-3 h-3" /> User
              </button>
              <button
                type="button"
                onClick={() => quickDemoLogin('admin')}
                className="py-1.5 px-2 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 font-medium flex items-center justify-center gap-1 transition"
              >
                <ShieldAlert className="w-3 h-3" /> Admin
              </button>
              <button
                type="button"
                onClick={() => quickDemoLogin('superadmin')}
                className="py-1.5 px-2 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 font-medium flex items-center justify-center gap-1 transition"
              >
                <ShieldCheck className="w-3 h-3" /> SuperAdmin
              </button>
            </div>
          </div>
        )}

        {errorNotice && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorNotice}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-electric-400 hover:text-electric-300">
                Forgot Password?
              </Link>
            </div>
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
            Sign In to Account
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
          Don't have an account yet?{' '}
          <Link to="/signup" className="text-electric-400 font-semibold hover:text-electric-300">
            Create Free Account
          </Link>
        </div>
      </GlassCard>
    </div>
  );
};
