import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
          Reset Your Password
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Enter your registered email address to receive password reset instructions
        </p>
      </div>

      <GlassCard className="p-8 space-y-6">
        {submitted ? (
          <div className="text-center py-4 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Reset Link Dispatched</h3>
            <p className="text-xs text-slate-400">
              If an account matches <strong className="text-white">{email}</strong>, you will receive password reset instructions.
            </p>
            <Link to="/login" className="inline-block mt-4">
              <Button variant="outline" size="sm">Back to Sign In</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Account Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-electric-500"
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" loading={loading}>
              Send Reset Instructions
            </Button>

            <div className="text-center pt-2 text-xs text-slate-400">
              <Link to="/login" className="text-electric-400 hover:text-electric-300">
                Cancel & return to Sign In
              </Link>
            </div>
          </form>
        )}
      </GlassCard>
    </div>
  );
};
