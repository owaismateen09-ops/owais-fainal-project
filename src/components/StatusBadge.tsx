import React from 'react';
import { JobStatus } from '../types';
import { CheckCircle2, Clock, Loader2, AlertCircle, XCircle } from 'lucide-react';

export const StatusBadge: React.FC<{ status: JobStatus; className?: string }> = ({ status, className = '' }) => {
  switch (status) {
    case 'completed':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ${className}`}>
          <CheckCircle2 className="w-3.5 h-3.5" />
          Completed
        </span>
      );
    case 'processing':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse ${className}`}>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Processing
        </span>
      );
    case 'queued':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 ${className}`}>
          <Clock className="w-3.5 h-3.5" />
          Queued
        </span>
      );
    case 'failed':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 ${className}`}>
          <AlertCircle className="w-3.5 h-3.5" />
          Failed
        </span>
      );
    case 'cancelled':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20 ${className}`}>
          <XCircle className="w-3.5 h-3.5" />
          Cancelled
        </span>
      );
    default:
      return null;
  }
};
