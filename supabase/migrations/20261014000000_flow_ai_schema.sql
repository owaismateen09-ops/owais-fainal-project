-- ====================================================================
-- FLOW AI STUDIO: COMPLETE PRODUCTION POSTGRESQL SCHEMA WITH RLS
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM ('user', 'admin', 'super_admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE job_type AS ENUM ('text_to_image', 'text_to_video', 'image_to_video', 'photo_edit', 'video_edit');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE job_status_type AS ENUM ('queued', 'processing', 'completed', 'failed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE asset_type AS ENUM ('image', 'video');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('reservation', 'deduction', 'refund', 'grant', 'adjustment');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    account_status TEXT DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'deactivated')),
    image_credits_remaining INT DEFAULT 20 CHECK (image_credits_remaining >= 0),
    video_credits_remaining INT DEFAULT 3 CHECK (video_credits_remaining >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. USER ROLES TABLE
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    role user_role_type DEFAULT 'user' NOT NULL,
    granted_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- 5. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. GENERATION JOBS TABLE
CREATE TABLE IF NOT EXISTS public.generation_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    job_type job_type NOT NULL,
    provider TEXT NOT NULL,
    model TEXT NOT NULL,
    provider_job_id TEXT,
    prompt TEXT NOT NULL,
    negative_prompt TEXT,
    parameters JSONB DEFAULT '{}'::jsonb,
    status job_status_type DEFAULT 'queued' NOT NULL,
    error_code TEXT,
    error_message TEXT,
    credit_cost INT DEFAULT 1,
    idempotency_key TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 7. MEDIA ASSETS TABLE
CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    source_job_id UUID REFERENCES public.generation_jobs(id) ON DELETE SET NULL,
    asset_type asset_type NOT NULL,
    storage_path TEXT NOT NULL,
    public_url TEXT,
    mime_type TEXT NOT NULL,
    file_size BIGINT DEFAULT 0,
    width INT,
    height INT,
    duration_seconds NUMERIC(6, 2),
    title TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. USAGE TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.usage_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    operation_ref TEXT,
    transaction_type transaction_type NOT NULL,
    credit_amount INT NOT NULL,
    idempotency_key TEXT UNIQUE,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. APP SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.app_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    updated_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. SUPPORT REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.support_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- INDEXES FOR PERFORMANCE
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_owner_id ON public.generation_jobs(owner_id);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_status ON public.generation_jobs(status);
CREATE INDEX IF NOT EXISTS idx_media_assets_owner_id ON public.media_assets(owner_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_asset_type ON public.media_assets(asset_type);
CREATE INDEX IF NOT EXISTS idx_usage_transactions_owner ON public.usage_transactions(owner_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check role securely
CREATE OR REPLACE FUNCTION public.has_role(req_user_id UUID, req_role user_role_type)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = req_user_id AND role = req_role
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can update own profile fields"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- User Roles Policies
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Only Super Admins can manage roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'super_admin'));

-- Projects Policies
CREATE POLICY "Users can manage own projects"
ON public.projects FOR ALL
USING (auth.uid() = owner_id);

-- Generation Jobs Policies
CREATE POLICY "Users can view own generation jobs"
ON public.generation_jobs FOR SELECT
USING (auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can insert own generation jobs"
ON public.generation_jobs FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own generation jobs"
ON public.generation_jobs FOR UPDATE
USING (auth.uid() = owner_id);

-- Media Assets Policies
CREATE POLICY "Users can view and manage own media assets"
ON public.media_assets FOR ALL
USING (auth.uid() = owner_id);

CREATE POLICY "Admins can view media assets for moderation"
ON public.media_assets FOR SELECT
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Usage Transactions Policies
CREATE POLICY "Users can view own transactions"
ON public.usage_transactions FOR SELECT
USING (auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- App Settings Policies
CREATE POLICY "Anyone authenticated can view public app settings"
ON public.app_settings FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Only Super Admins can update app settings"
ON public.app_settings FOR ALL
USING (public.has_role(auth.uid(), 'super_admin'));

-- Support Requests Policies
CREATE POLICY "Users can view and create own support requests"
ON public.support_requests FOR SELECT
USING (auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Anyone can create a support request"
ON public.support_requests FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can update support requests"
ON public.support_requests FOR UPDATE
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Audit Logs Policies
CREATE POLICY "Only Admins and Super Admins can view audit logs"
ON public.audit_logs FOR SELECT
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- ====================================================================
-- SECURE FUNCTIONS & DATABASE TRIGGERS
-- ====================================================================

-- Automatic profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, display_name, image_credits_remaining, video_credits_remaining)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        20,
        3
    );

    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger attached to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Atomic Credit Reservation & Deduction function
CREATE OR REPLACE FUNCTION public.deduct_user_credits(
    p_user_id UUID,
    p_credit_type TEXT, -- 'image' or 'video'
    p_amount INT,
    p_reason TEXT,
    p_idempotency_key TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_current_balance INT;
    v_updated_balance INT;
BEGIN
    -- Check for idempotency
    IF EXISTS (SELECT 1 FROM public.usage_transactions WHERE idempotency_key = p_idempotency_key) THEN
        RETURN jsonb_build_object('success', true, 'message', 'Already processed');
    END IF;

    IF p_credit_type = 'image' THEN
        SELECT image_credits_remaining INTO v_current_balance
        FROM public.profiles WHERE user_id = p_user_id FOR UPDATE;

        IF v_current_balance < p_amount THEN
            RETURN jsonb_build_object('success', false, 'error', 'Insufficient image credits');
        END IF;

        UPDATE public.profiles
        SET image_credits_remaining = image_credits_remaining - p_amount,
            updated_at = NOW()
        WHERE user_id = p_user_id
        RETURNING image_credits_remaining INTO v_updated_balance;

    ELSIF p_credit_type = 'video' THEN
        SELECT video_credits_remaining INTO v_current_balance
        FROM public.profiles WHERE user_id = p_user_id FOR UPDATE;

        IF v_current_balance < p_amount THEN
            RETURN jsonb_build_object('success', false, 'error', 'Insufficient video credits');
        END IF;

        UPDATE public.profiles
        SET video_credits_remaining = video_credits_remaining - p_amount,
            updated_at = NOW()
        WHERE user_id = p_user_id
        RETURNING video_credits_remaining INTO v_updated_balance;
    ELSE
        RETURN jsonb_build_object('success', false, 'error', 'Invalid credit type');
    END IF;

    -- Record transaction
    INSERT INTO public.usage_transactions (
        owner_id, operation_ref, transaction_type, credit_amount, idempotency_key, reason
    ) VALUES (
        p_user_id, p_credit_type, 'deduction', p_amount, p_idempotency_key, p_reason
    );

    RETURN jsonb_build_object('success', true, 'remaining', v_updated_balance);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Default Settings Seed
INSERT INTO public.app_settings (setting_key, setting_value)
VALUES
    ('maintenance_mode', '{"enabled": false, "message": "System is undergoing maintenance."}'::jsonb),
    ('feature_flags', '{"image_generation": true, "video_generation": true, "photo_editor": true, "video_editor": true}'::jsonb),
    ('credit_costs', '{"image_generate": 1, "video_generate": 1, "photo_edit": 0, "video_edit": 0}'::jsonb),
    ('branding', '{"app_name": "Flow AI Studio", "tagline": "Next-Gen AI Creative Workspace"}'::jsonb)
ON CONFLICT (setting_key) DO NOTHING;
