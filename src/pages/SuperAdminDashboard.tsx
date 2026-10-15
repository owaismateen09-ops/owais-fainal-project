import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockStorage } from '../lib/mockStorage';
import { getProviderHealth } from '../lib/aiProviders';
import { AppSettings, AuditLog } from '../types';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import {
  ShieldCheck,
  Server,
  ToggleLeft,
  ToggleRight,
  Settings,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Lock,
  HardDrive,
  Cpu,
  Save,
  Check,
  KeyRound
} from 'lucide-react';

export const SuperAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<AppSettings>(() => mockStorage.getAppSettings());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [providerHealth] = useState(getProviderHealth());
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Editable fields
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(settings.maintenance_mode.enabled);
  const [maintenanceMsg, setMaintenanceMsg] = useState(settings.maintenance_mode.message);
  const [appName, setAppName] = useState(settings.branding.app_name);
  const [tagline, setTagline] = useState(settings.branding.tagline);
  const [flags, setFlags] = useState(settings.feature_flags);

  useEffect(() => {
    setAuditLogs(mockStorage.getAuditLogs());
  }, []);

  const handleSaveSettings = () => {
    const updated: AppSettings = {
      ...settings,
      maintenance_mode: {
        enabled: maintenanceEnabled,
        message: maintenanceMsg
      },
      branding: {
        app_name: appName,
        tagline: tagline
      },
      feature_flags: flags
    };

    mockStorage.saveAppSettings(updated);
    setSettings(updated);
    mockStorage.addAuditLog(
      'UPDATE_SYSTEM_SETTINGS',
      'APP_SETTINGS',
      { maintenance_mode: maintenanceEnabled, flags },
      user?.email
    );
    setAuditLogs(mockStorage.getAuditLogs());

    setSaveSuccess('Global settings updated and recorded to audit ledger!');
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Super Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Highest Privilege Tier: Super Admin
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
            Super Admin Control Center
          </h1>
          <p className="text-sm text-slate-400">
            System configuration, upstream AI provider health, feature flags, maintenance switch, and audit trail.
          </p>
        </div>

        <Button variant="primary" size="sm" icon={<Save className="w-4 h-4" />} onClick={handleSaveSettings}>
          Save System Settings
        </Button>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Upstream AI Provider Health Matrix */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 font-['Space_Grotesk']">
          <Server className="w-4 h-4 text-amber-400" />
          Upstream AI Provider Connectivity Health
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(providerHealth).map(([key, provider]) => (
            <GlassCard key={key} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{provider.name}</span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" title="Awaiting Server Secret" />
              </div>
              <p className="text-[11px] text-slate-400">{provider.type}</p>
              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
                <span>Secret:</span>
                <code className="text-amber-300 font-mono">{provider.requiredEnv}</code>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Feature Toggles & Maintenance Mode Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Feature Toggles */}
        <GlassCard className="p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-electric-400" />
              Feature Flags & Modules
            </h3>
            <span className="text-xs text-slate-500">Live Toggles</span>
          </div>

          <div className="space-y-3">
            {[
              { key: 'image_generation', label: 'AI Image Studio Module', desc: 'Enable text-to-image prompts & DALL-E' },
              { key: 'video_generation', label: 'AI Video Synthesis Module', desc: 'Enable text/image-to-video processing' },
              { key: 'photo_editor', label: 'Canvas Photo Editor', desc: 'Enable browser-based pixel filters & rotation' },
              { key: 'video_editor', label: 'Timeline Video Trimmer', desc: 'Enable in-browser video trimming & text stamps' },
            ].map((item) => {
              const isEnabled = flags[item.key as keyof typeof flags];
              return (
                <div key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-dark-950 border border-slate-800">
                  <div>
                    <h4 className="text-xs font-semibold text-white">{item.label}</h4>
                    <p className="text-[10px] text-slate-400">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFlags({ ...flags, [item.key]: !isEnabled })}
                    className="text-electric-400 hover:text-white transition"
                  >
                    {isEnabled ? (
                      <ToggleRight className="w-7 h-7 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-7 h-7 text-slate-600" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Maintenance Mode & Branding */}
        <GlassCard className="p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
              <Settings className="w-4 h-4 text-amber-400" />
              Maintenance & System Branding
            </h3>
            <span className="text-xs text-slate-500">Protected</span>
          </div>

          {/* Maintenance Switch */}
          <div className="p-3.5 rounded-xl bg-dark-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white">System Maintenance Mode</span>
                <p className="text-[10px] text-slate-400">Temporarily disables public generation requests</p>
              </div>
              <button
                type="button"
                onClick={() => setMaintenanceEnabled(!maintenanceEnabled)}
                className="transition"
              >
                {maintenanceEnabled ? (
                  <ToggleRight className="w-7 h-7 text-amber-400" />
                ) : (
                  <ToggleLeft className="w-7 h-7 text-slate-600" />
                )}
              </button>
            </div>
            {maintenanceEnabled && (
              <input
                type="text"
                value={maintenanceMsg}
                onChange={(e) => setMaintenanceMsg(e.target.value)}
                placeholder="Maintenance banner message..."
                className="w-full bg-dark-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            )}
          </div>

          {/* Branding Customizer */}
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                Platform Brand Name
              </label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                Header Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Immutable Audit Logs Table */}
      <GlassCard className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            Security & Administration Audit Trail
          </h3>
          <span className="text-xs text-slate-500">Immutable Ledger</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-slate-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Log ID</th>
                <th className="py-2.5 px-3">Actor</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Target</th>
                <th className="py-2.5 px-3">Metadata</th>
                <th className="py-2.5 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono text-[11px]">
              {auditLogs.map((log) => (
                <tr key={log.id}>
                  <td className="py-2.5 px-3 text-slate-500">{log.id}</td>
                  <td className="py-2.5 px-3 text-white font-sans">{log.actor_email || 'system'}</td>
                  <td className="py-2.5 px-3 text-amber-400">{log.action}</td>
                  <td className="py-2.5 px-3 text-slate-400 font-sans">{log.target_type}</td>
                  <td className="py-2.5 px-3 text-slate-500 truncate max-w-[200px]">
                    {JSON.stringify(log.metadata || {})}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 font-sans">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
