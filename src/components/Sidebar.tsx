import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuota } from '../context/QuotaContext';
import {
  LayoutDashboard,
  Wand2,
  Video,
  Crop,
  Film,
  FolderHeart,
  History,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Coins
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { role } = useAuth();
  const { imageCredits, videoCredits } = useQuota();
  const location = useLocation();

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'AI Image Studio', path: '/image-generator', icon: Wand2, color: 'text-electric-400' },
    { label: 'AI Video Studio', path: '/video-generator', icon: Video, color: 'text-violet-400' },
    { label: 'Photo Editor', path: '/photo-editor', icon: Crop, color: 'text-cyan-400' },
    { label: 'Video Editor', path: '/video-editor', icon: Film, color: 'text-pink-400' },
    { label: 'My Creations', path: '/my-creations', icon: FolderHeart },
    { label: 'Generation History', path: '/generation-history', icon: History },
    { label: 'Account & Settings', path: '/profile', icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col border-r border-slate-800/80 bg-dark-950/70 p-4 space-y-6">
      {/* Credits Card Widget */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-dark-900 to-dark-850 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
          <span className="flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-amber-400" /> Available Quota
          </span>
          <span className="text-[10px] uppercase tracking-wider text-slate-500">Free Tier</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-2 rounded-xl bg-dark-950/80 border border-slate-800">
            <span className="text-lg font-bold text-white block">{imageCredits}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Image Credits</span>
          </div>
          <div className="p-2 rounded-xl bg-dark-950/80 border border-slate-800">
            <span className="text-lg font-bold text-white block">{videoCredits}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Video Credits</span>
          </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 space-y-1">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
          Studio Workspaces
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-electric-600/15 text-white border border-electric-500/30 shadow-glow-blue'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? 'text-electric-400' : item.color || 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* Administration Links */}
        {(role === 'admin' || role === 'super_admin') && (
          <div className="pt-6">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
              Administration
            </div>
            <Link
              to="/admin"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                location.pathname === '/admin'
                  ? 'bg-violet-600/20 text-white border border-violet-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-violet-400" />
              <span>Admin Center</span>
            </Link>

            {role === 'super_admin' && (
              <Link
                to="/super-admin"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === '/super-admin'
                    ? 'bg-amber-600/20 text-white border border-amber-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Super Admin Hub</span>
              </Link>
            )}
          </div>
        )}
      </nav>
    </aside>
  );
};
