export type UserRole = 'user' | 'admin' | 'super_admin';

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  account_status: 'active' | 'suspended' | 'deactivated';
  image_credits_remaining: number;
  video_credits_remaining: number;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export type JobType = 'text_to_image' | 'text_to_video' | 'image_to_video' | 'photo_edit' | 'video_edit';

export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface GenerationJob {
  id: string;
  owner_id: string;
  project_id?: string;
  job_type: JobType;
  provider: 'openai' | 'stability' | 'runway' | 'replicate' | 'local_canvas';
  model: string;
  provider_job_id?: string;
  prompt: string;
  negative_prompt?: string;
  parameters: Record<string, any>;
  status: JobStatus;
  error_code?: string;
  error_message?: string;
  credit_cost: number;
  idempotency_key?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  result_asset_url?: string;
  result_asset_id?: string;
}

export type AssetType = 'image' | 'video';

export interface MediaAsset {
  id: string;
  owner_id: string;
  project_id?: string;
  source_job_id?: string;
  asset_type: AssetType;
  storage_path: string;
  public_url: string;
  mime_type: string;
  file_size: number;
  width?: number;
  height?: number;
  duration_seconds?: number;
  title: string;
  prompt?: string;
  created_at: string;
  tags?: string[];
}

export interface UsageTransaction {
  id: string;
  owner_id: string;
  operation_ref: string;
  transaction_type: 'reservation' | 'deduction' | 'refund' | 'grant' | 'adjustment';
  credit_amount: number;
  idempotency_key?: string;
  reason: string;
  created_at: string;
}

export interface AppSettings {
  maintenance_mode: {
    enabled: boolean;
    message: string;
  };
  feature_flags: {
    image_generation: boolean;
    video_generation: boolean;
    photo_editor: boolean;
    video_editor: boolean;
  };
  credit_costs: {
    image_generate: number;
    video_generate: number;
    photo_edit: number;
    video_edit: number;
  };
  branding: {
    app_name: string;
    tagline: string;
  };
}

export interface SupportRequest {
  id: string;
  owner_id?: string;
  email: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  actor_id?: string;
  actor_email?: string;
  action: string;
  target_type: string;
  target_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
}
