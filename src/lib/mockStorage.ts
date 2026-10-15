import { MediaAsset, GenerationJob, UsageTransaction, SupportRequest, AuditLog, AppSettings, UserProfile } from '../types';

const ASSETS_KEY = 'flow_ai_media_assets';
const JOBS_KEY = 'flow_ai_generation_jobs';
const TRANSACTIONS_KEY = 'flow_ai_transactions';
const TICKETS_KEY = 'flow_ai_support_tickets';
const SETTINGS_KEY = 'flow_ai_app_settings';
const LOGS_KEY = 'flow_ai_audit_logs';

export const INITIAL_ASSETS: MediaAsset[] = [
  {
    id: 'asset-1',
    owner_id: 'demo-user-id',
    asset_type: 'image',
    title: 'Neon Cyberpunk Metropolis',
    prompt: 'Hyper-detailed futuristic cyberpunk city at midnight, neon reflections in rainwater, cinematic lighting, 8k resolution',
    storage_path: 'user-assets/demo/cyberpunk_city.jpg',
    public_url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80',
    mime_type: 'image/jpeg',
    file_size: 2450000,
    width: 1920,
    height: 1080,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    tags: ['Cyberpunk', '16:9', 'DALL-E 3']
  },
  {
    id: 'asset-2',
    owner_id: 'demo-user-id',
    asset_type: 'image',
    title: 'Ethereal Cosmic Nebula Flower',
    prompt: 'Macro shot of glowing bioluminescent flower blooming inside deep space nebula, soft purple and turquoise light petals',
    storage_path: 'user-assets/demo/cosmic_flower.jpg',
    public_url: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=1200&q=80',
    mime_type: 'image/jpeg',
    file_size: 1850000,
    width: 1024,
    height: 1024,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    tags: ['Fantasy', '1:1', 'Stable Diffusion']
  },
  {
    id: 'asset-3',
    owner_id: 'demo-user-id',
    asset_type: 'video',
    title: 'Cinematic Ocean Waves Motion',
    prompt: 'Aerial drone footage gliding over crystalline turquoise ocean waves crashing on black volcanic sand, sunset golden hour',
    storage_path: 'user-assets/demo/ocean_waves.mp4',
    public_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    mime_type: 'video/mp4',
    file_size: 15400000,
    width: 1920,
    height: 1080,
    duration_seconds: 15.0,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    tags: ['Cinematic', 'Video', 'Runway Gen-2']
  },
  {
    id: 'asset-4',
    owner_id: 'demo-user-id',
    asset_type: 'image',
    title: 'Surreal Architectural Sanctum',
    prompt: 'Minimalist white brutalist architectural palace surrounded by tranquil reflective water pools, warm sunlight rays',
    storage_path: 'user-assets/demo/sanctum.jpg',
    public_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    mime_type: 'image/jpeg',
    file_size: 2100000,
    width: 1200,
    height: 800,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    tags: ['Architecture', 'Photorealistic']
  }
];

export const INITIAL_JOBS: GenerationJob[] = [
  {
    id: 'job-101',
    owner_id: 'demo-user-id',
    job_type: 'text_to_image',
    provider: 'openai',
    model: 'dall-e-3',
    prompt: 'Hyper-detailed futuristic cyberpunk city at midnight, neon reflections in rainwater',
    parameters: { aspect_ratio: '16:9', quality: 'standard' },
    status: 'completed',
    credit_cost: 1,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    completed_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    result_asset_url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80',
    result_asset_id: 'asset-1'
  },
  {
    id: 'job-102',
    owner_id: 'demo-user-id',
    job_type: 'text_to_video',
    provider: 'runway',
    model: 'gen-2',
    prompt: 'Aerial drone footage gliding over crystalline turquoise ocean waves crashing on black volcanic sand',
    parameters: { duration: '15s', motion: 5 },
    status: 'completed',
    credit_cost: 1,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    completed_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    result_asset_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    result_asset_id: 'asset-3'
  }
];

export const mockStorage = {
  getAssets(): MediaAsset[] {
    const raw = localStorage.getItem(ASSETS_KEY);
    if (!raw) {
      localStorage.setItem(ASSETS_KEY, JSON.stringify(INITIAL_ASSETS));
      return INITIAL_ASSETS;
    }
    return JSON.parse(raw);
  },

  saveAsset(asset: MediaAsset): void {
    const assets = this.getAssets();
    assets.unshift(asset);
    localStorage.setItem(ASSETS_KEY, JSON.stringify(assets));
  },

  deleteAsset(assetId: string): void {
    const assets = this.getAssets().filter(a => a.id !== assetId);
    localStorage.setItem(ASSETS_KEY, JSON.stringify(assets));
  },

  renameAsset(assetId: string, newTitle: string): void {
    const assets = this.getAssets().map(a => a.id === assetId ? { ...a, title: newTitle } : a);
    localStorage.setItem(ASSETS_KEY, JSON.stringify(assets));
  },

  getJobs(): GenerationJob[] {
    const raw = localStorage.getItem(JOBS_KEY);
    if (!raw) {
      localStorage.setItem(JOBS_KEY, JSON.stringify(INITIAL_JOBS));
      return INITIAL_JOBS;
    }
    return JSON.parse(raw);
  },

  saveJob(job: GenerationJob): void {
    const jobs = this.getJobs();
    const existingIndex = jobs.findIndex(j => j.id === job.id);
    if (existingIndex >= 0) {
      jobs[existingIndex] = job;
    } else {
      jobs.unshift(job);
    }
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
  },

  getSupportTickets(): SupportRequest[] {
    const raw = localStorage.getItem(TICKETS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  },

  saveSupportTicket(ticket: SupportRequest): void {
    const tickets = this.getSupportTickets();
    tickets.unshift(ticket);
    localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
  },

  getAuditLogs(): AuditLog[] {
    const raw = localStorage.getItem(LOGS_KEY);
    if (!raw) {
      const defaultLogs: AuditLog[] = [
        {
          id: 'log-1',
          actor_email: 'superadmin@flowai.studio',
          action: 'SYSTEM_BOOTSTRAP',
          target_type: 'SYSTEM',
          metadata: { version: '1.0.0', status: 'initialized' },
          created_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 'log-2',
          actor_email: 'admin@flowai.studio',
          action: 'REVIEW_JOB_QUEUE',
          target_type: 'QUEUE',
          metadata: { active_jobs: 2, completed_today: 14 },
          created_at: new Date(Date.now() - 14400000).toISOString()
        }
      ];
      localStorage.setItem(LOGS_KEY, JSON.stringify(defaultLogs));
      return defaultLogs;
    }
    return JSON.parse(raw);
  },

  addAuditLog(action: string, targetType: string, metadata?: Record<string, any>, email?: string): void {
    const logs = this.getAuditLogs();
    logs.unshift({
      id: 'log-' + Date.now(),
      actor_email: email || 'system@flowai.studio',
      action,
      target_type: targetType,
      metadata,
      created_at: new Date().toISOString()
    });
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  },

  getAppSettings(): AppSettings {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      const defaultSettings: AppSettings = {
        maintenance_mode: {
          enabled: false,
          message: 'Flow AI Studio is currently undergoing scheduled optimization.'
        },
        feature_flags: {
          image_generation: true,
          video_generation: true,
          photo_editor: true,
          video_editor: true
        },
        credit_costs: {
          image_generate: 1,
          video_generate: 1,
          photo_edit: 0,
          video_edit: 0
        },
        branding: {
          app_name: 'Flow AI Studio',
          tagline: 'Next-Gen AI Image & Video Studio'
        }
      };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
      return defaultSettings;
    }
    return JSON.parse(raw);
  },

  saveAppSettings(settings: AppSettings): void {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }
};
