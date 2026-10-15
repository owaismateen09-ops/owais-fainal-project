import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuota } from '../context/QuotaContext';
import { mockStorage } from '../lib/mockStorage';
import { UsageTransaction } from '../types';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import {
  User,
  Mail,
  Shield,
  Coins,
  Receipt,
  Check,
  Sparkles,
  KeyRound,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const ProfileSettings: React.FC = () => {
  const { user, role, switchDemoRole, isSandbox, refreshProfile } = useAuth();
  const { imageCredits, videoCredits } = useQuota();

  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [transactions, setTransactions] = useState<UsageTransaction[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem('flow_ai_transactions');
    if (raw) {
      setTransactions(JSON.parse(raw));
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const updated = { ...user, display_name: displayName };
      localStorage.setItem('flow_ai_user_profile', JSON.stringify(updated));
      refreshProfile();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-500/10 border border-electric-500/20 text-electric-400 text-xs font-medium mb-2">
          <User className="w-3.5 h-3.5" />
          Account & Quota Controls
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
          Profile & Quota Ledger
        </h1>
        <p className="text-sm text-slate-400">
          Manage your creative identity, inspect credit transaction logs, and review role permissions.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Account Details */}
        <div className="md:col-span-1 space-y-6">
          <GlassCard className="p-6 text-center space-y-4">
            <div className="w-20 h-20 rounded-2xl mx-auto overflow-hidden border-2 border-electric-500/40 p-0.5 bg-dark-950">
              <img
                src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt="Avatar"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{user?.display_name || 'Creator'}</h3>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-dark-950 border border-slate-700 text-electric-400">
              <Shield className="w-3.5 h-3.5" />
              Role: {role.replace(/_/g, ' ')}
            </div>

            {/* Quota Stats Box */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800 text-left">
              <div className="p-2.5 rounded-xl bg-dark-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Image Quota</span>
                <span className="text-base font-bold text-white font-mono">{imageCredits}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-dark-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Video Quota</span>
                <span className="text-base font-bold text-white font-mono">{videoCredits}</span>
              </div>
            </div>
          </GlassCard>

          {/* Sandbox Role Switcher */}
          {isSandbox && (
            <GlassCard className="p-5 space-y-3">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Testing Role Simulator
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Test the application as a normal User, Staff Admin, or Super Admin without modifying database rows.
              </p>
              <div className="space-y-1.5">
                <Button
                  variant={role === 'user' ? 'primary' : 'outline'}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => switchDemoRole('user')}
                  icon={<UserCheck className="w-4 h-4 text-electric-400" />}
                >
                  Regular User (Creator)
                </Button>
                <Button
                  variant={role === 'admin' ? 'primary' : 'outline'}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => switchDemoRole('admin')}
                  icon={<Shield className="w-4 h-4 text-violet-400" />}
                >
                  Staff Admin (Moderator)
                </Button>
                <Button
                  variant={role === 'super_admin' ? 'primary' : 'outline'}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => switchDemoRole('super_admin')}
                  icon={<ShieldCheck className="w-4 h-4 text-amber-400" />}
                >
                  Super Admin (Owner)
                </Button>
              </div>
            </GlassCard>
          )}
        </div>

        {/* Right Column: Editable Profile & Transactions */}
        <div className="md:col-span-2 space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-base font-bold text-white mb-4 font-['Space_Grotesk']">
              Account Information
            </h3>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-electric-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full bg-dark-950/50 border border-slate-800/60 rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Managed via Supabase Auth identity provider.
                </span>
              </div>

              <Button type="submit" size="sm">
                Save Changes
              </Button>
            </form>
          </GlassCard>

          {/* Usage Transactions Ledger */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-['Space_Grotesk']">
                <Receipt className="w-4 h-4 text-amber-400" />
                Credit Transaction Ledger
              </h3>
              <span className="text-xs text-slate-500">Atomic Database Records</span>
            </div>

            {transactions.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">
                No transactions recorded yet. Deductions appear here when generating images or video clips.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 text-slate-500 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Operation / Reason</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {transactions.map((tx) => (
                      <tr key={tx.id}>
                        <td className="py-2.5 px-3 max-w-[200px] truncate">{tx.reason || tx.operation_ref}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold ${
                            tx.transaction_type === 'deduction'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}>
                            {tx.transaction_type}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-white">
                          {tx.transaction_type === 'deduction' ? `-${tx.credit_amount}` : `+${tx.credit_amount}`}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500">
                          {new Date(tx.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
