import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockStorage } from '../lib/mockStorage';
import { GenerationJob, SupportRequest, MediaAsset } from '../types';
import { GlassCard } from '../components/GlassCard';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import {
  ShieldAlert,
  Users,
  Film,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Search,
  Check,
  RotateCcw
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, role } = useAuth();

  const [jobs, setJobs] = useState<GenerationJob[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportRequest[]>([]);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [activeTab, setActiveTab] = useState<'jobs' | 'tickets' | 'moderation'>('jobs');
  const [searchUser, setSearchUser] = useState('');

  useEffect(() => {
    setJobs(mockStorage.getJobs());
    setSupportTickets(mockStorage.getSupportTickets());
    setAssets(mockStorage.getAssets());
  }, []);

  const failedJobs = jobs.filter(j => j.status === 'failed');

  const handleResolveTicket = (id: string) => {
    const updated = supportTickets.map(t => t.id === id ? { ...t, status: 'resolved' as const } : t);
    setSupportTickets(updated);
    localStorage.setItem('flow_ai_support_tickets', JSON.stringify(updated));
    mockStorage.addAuditLog('RESOLVE_SUPPORT_TICKET', 'SUPPORT_TICKET', { ticket_id: id }, user?.email);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            Staff Moderation & Operations
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
            Admin Center
          </h1>
          <p className="text-sm text-slate-400">
            Monitor generation queues, inspect failed job error codes, and manage user support tickets.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold">
          Active Role: Staff Admin
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <GlassCard glow="violet" className="p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Total Generation Jobs</span>
            <Film className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{jobs.length}</div>
          <div className="text-[11px] text-slate-500 mt-2">Processed across cluster</div>
        </GlassCard>

        <GlassCard glow="none" className="p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Failed Jobs</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{failedJobs.length}</div>
          <div className="text-[11px] text-slate-500 mt-2">Refunded automatically</div>
        </GlassCard>

        <GlassCard glow="blue" className="p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Open Support Tickets</span>
            <MessageSquare className="w-4 h-4 text-electric-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {supportTickets.filter(t => t.status === 'open').length}
          </div>
          <div className="text-[11px] text-slate-500 mt-2">Awaiting staff response</div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Indexed Media Assets</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{assets.length}</div>
          <div className="text-[11px] text-slate-500 mt-2">Private cloud vaults</div>
        </GlassCard>
      </div>

      {/* Admin Tabs */}
      <div className="flex rounded-xl bg-dark-950 p-1 border border-slate-800 w-fit text-xs font-semibold">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === 'jobs' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Job Monitoring ({jobs.length})
        </button>
        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === 'tickets' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Support Requests ({supportTickets.length})
        </button>
        <button
          onClick={() => setActiveTab('moderation')}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === 'moderation' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Content Moderation ({assets.length})
        </button>
      </div>

      {/* Tab 1: Generation Jobs Monitoring */}
      {activeTab === 'jobs' && (
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
              Live Job Queue & Error Inspection
            </h3>
            <span className="text-xs text-slate-500">Auto-refresh active</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Job ID</th>
                  <th className="py-2.5 px-3">Provider</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Prompt</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td className="py-2.5 px-3 font-mono text-slate-400">{job.id}</td>
                    <td className="py-2.5 px-3 font-semibold uppercase">{job.provider}</td>
                    <td className="py-2.5 px-3">{job.job_type}</td>
                    <td className="py-2.5 px-3 max-w-[240px] truncate italic">{job.prompt}</td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {new Date(job.created_at).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Tab 2: Support Requests */}
      {activeTab === 'tickets' && (
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
            Support Ticketing System
          </h3>

          {supportTickets.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-10">
              No support tickets found. Messages submitted via the Contact page will appear here.
            </p>
          ) : (
            <div className="space-y-3">
              {supportTickets.map((ticket) => (
                <div key={ticket.id} className="p-4 rounded-xl bg-dark-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white">{ticket.subject}</span>
                      <span className="text-[11px] text-slate-500 ml-2">from {ticket.email}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      ticket.status === 'resolved'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">{ticket.message}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-850 text-[10px] text-slate-500">
                    <span>{new Date(ticket.created_at).toLocaleString()}</span>
                    {ticket.status !== 'resolved' && (
                      <Button
                        size="sm"
                        variant="outline"
                        icon={<Check className="w-3 h-3 text-emerald-400" />}
                        onClick={() => handleResolveTicket(ticket.id)}
                      >
                        Mark Resolved
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      )}

      {/* Tab 3: Content Moderation */}
      {activeTab === 'moderation' && (
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
            Media Asset Moderation Overview
          </h3>
          <p className="text-xs text-slate-400">
            Inspect public and private media generated across user workspaces. Staff admins can review prompts and dimensions.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            {assets.map((asset) => (
              <div key={asset.id} className="p-2.5 rounded-xl bg-dark-950 border border-slate-800 space-y-2">
                <div className="h-28 rounded-lg overflow-hidden bg-black">
                  {asset.asset_type === 'image' ? (
                    <img src={asset.public_url} alt={asset.title} className="w-full h-full object-cover" />
                  ) : (
                    <video src={asset.public_url} className="w-full h-full object-cover" muted />
                  )}
                </div>
                <div className="text-[11px] font-semibold text-white truncate">{asset.title}</div>
                <div className="text-[10px] text-slate-500 truncate">{asset.mime_type}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
};
