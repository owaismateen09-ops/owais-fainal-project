import React, { useState, useEffect } from 'react';
import { mockStorage } from '../lib/mockStorage';
import { GenerationJob } from '../types';
import { GlassCard } from '../components/GlassCard';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import {
  History,
  RotateCcw,
  Clock,
  Layers,
  Wand2,
  Video,
  ExternalLink,
  Coins
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const GenerationHistory: React.FC = () => {
  const [jobs, setJobs] = useState<GenerationJob[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    setJobs(mockStorage.getJobs());
  }, []);

  const filteredJobs = jobs.filter((job) => {
    if (filterType !== 'all' && job.job_type !== filterType) return false;
    if (filterStatus !== 'all' && job.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium mb-2">
            <History className="w-3.5 h-3.5" />
            Audit & Process Logs
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
            Generation Job History
          </h1>
          <p className="text-sm text-slate-400">
            Immutable log of all image and video generation jobs, upstream provider identifiers, statuses, and costs.
          </p>
        </div>

        <div className="flex gap-2">
          <Link to="/image-generator">
            <Button size="sm" icon={<Wand2 className="w-3.5 h-3.5" />}>New Image</Button>
          </Link>
          <Link to="/video-generator">
            <Button size="sm" variant="secondary" icon={<Video className="w-3.5 h-3.5 text-violet-400" />}>New Video</Button>
          </Link>
        </div>
      </div>

      {/* Filters Bar */}
      <GlassCard className="p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium mr-1">Job Type:</span>
          {['all', 'text_to_image', 'text_to_video', 'image_to_video'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filterType === t ? 'bg-electric-600 text-white' : 'bg-dark-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {t.replace(/_/g, ' ').toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-dark-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-300 focus:outline-none focus:border-violet-500"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </GlassCard>

      {/* Jobs Log Table / List */}
      {filteredJobs.length === 0 ? (
        <GlassCard className="p-16 text-center">
          <History className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No Generation Records Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Jobs generated via Image Studio or Video Studio will appear here automatically.
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <GlassCard key={job.id} className="p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-dark-950 border border-slate-800 flex items-center justify-center text-slate-400">
                    {job.job_type.includes('image') ? <Wand2 className="w-4 h-4 text-electric-400" /> : <Video className="w-4 h-4 text-violet-400" />}
                  </div>
                  <div>
                    <span className="text-xs font-mono text-slate-400 block">{job.id}</span>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      {job.provider} • {job.model}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs text-amber-400 font-medium">
                    <Coins className="w-3.5 h-3.5" />
                    <span>{job.credit_cost} Credit</span>
                  </div>
                  <StatusBadge status={job.status} />
                </div>
              </div>

              {/* Prompt Text */}
              <p className="text-sm text-slate-200 leading-relaxed font-light">
                <span className="text-slate-500 font-medium">Prompt:</span> "{job.prompt}"
              </p>

              {/* Error Message if failed */}
              {job.error_message && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                  <span className="font-semibold text-rose-400">Provider Status:</span> {job.error_message}
                </div>
              )}

              {/* Metadata and Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 pt-2">
                <div className="flex items-center gap-4 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(job.created_at).toLocaleString()}
                  </span>
                  {job.completed_at && (
                    <span>Finished: {new Date(job.completed_at).toLocaleTimeString()}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {job.status === 'failed' && (
                    <Link to={job.job_type.includes('image') ? '/image-generator' : '/video-generator'}>
                      <Button variant="outline" size="sm" icon={<RotateCcw className="w-3 h-3" />}>
                        Retry in Studio
                      </Button>
                    </Link>
                  )}
                  {job.result_asset_url && (
                    <a href={job.result_asset_url} target="_blank" rel="noreferrer">
                      <Button variant="secondary" size="sm" icon={<ExternalLink className="w-3 h-3" />}>
                        View Media
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
