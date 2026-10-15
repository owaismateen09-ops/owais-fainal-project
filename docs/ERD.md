# Flow AI Studio — Entity Relationship Diagram (ERD)

This document describes the complete relational database model designed for **Flow AI Studio**, implemented in PostgreSQL on Supabase with Row Level Security (RLS).

## Mermaid ER Diagram

```mermaid
erDiagram
    AUTH_USERS ||--|| PROFILES : "has one profile (user_id)"
    PROFILES ||--|{ USER_ROLES : "assigned roles"
    PROFILES ||--o{ PROJECTS : "owns projects"
    PROFILES ||--o{ GENERATION_JOBS : "triggers generation jobs"
    PROFILES ||--o{ MEDIA_ASSETS : "owns media assets"
    PROFILES ||--o{ USAGE_TRANSACTIONS : "incurs credit transactions"
    PROFILES ||--o{ SUPPORT_REQUESTS : "submits tickets"
    AUTH_USERS ||--o{ AUDIT_LOGS : "performed administrative action"

    PROJECTS ||--o{ GENERATION_JOBS : "organizes jobs"
    PROJECTS ||--o{ MEDIA_ASSETS : "contains assets"
    GENERATION_JOBS ||--o{ MEDIA_ASSETS : "produces output asset"

    PROFILES {
        UUID id PK
        UUID user_id FK "References auth.users"
        TEXT email
        TEXT display_name
        TEXT avatar_url
        TEXT account_status "active, suspended, deactivated"
        INT image_credits_remaining "Default 20"
        INT video_credits_remaining "Default 3"
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    USER_ROLES {
        UUID id PK
        UUID user_id FK "References profiles.user_id"
        ENUM role "user, admin, super_admin"
        UUID granted_by FK "References auth.users"
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    PROJECTS {
        UUID id PK
        UUID owner_id FK "References profiles.user_id"
        TEXT title
        TEXT description
        JSONB metadata
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    GENERATION_JOBS {
        UUID id PK
        UUID owner_id FK "References profiles.user_id"
        UUID project_id FK "References projects.id"
        ENUM job_type "text_to_image, text_to_video, image_to_video, photo_edit, video_edit"
        TEXT provider "openai, stability, runway, replicate"
        TEXT model
        TEXT provider_job_id
        TEXT prompt
        TEXT negative_prompt
        JSONB parameters
        ENUM status "queued, processing, completed, failed, cancelled"
        TEXT error_code
        TEXT error_message
        INT credit_cost
        TEXT idempotency_key
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
        TIMESTAMPTZ completed_at
    }

    MEDIA_ASSETS {
        UUID id PK
        UUID owner_id FK "References profiles.user_id"
        UUID project_id FK "References projects.id"
        UUID source_job_id FK "References generation_jobs.id"
        ENUM asset_type "image, video"
        TEXT storage_path
        TEXT public_url
        TEXT mime_type
        BIGINT file_size
        INT width
        INT height
        NUMERIC duration_seconds
        TEXT title
        TIMESTAMPTZ created_at
    }

    USAGE_TRANSACTIONS {
        UUID id PK
        UUID owner_id FK "References profiles.user_id"
        TEXT operation_ref
        ENUM transaction_type "reservation, deduction, refund, grant, adjustment"
        INT credit_amount
        TEXT idempotency_key
        TEXT reason
        TIMESTAMPTZ created_at
    }

    APP_SETTINGS {
        UUID id PK
        TEXT setting_key UK
        JSONB setting_value
        UUID updated_by FK "References auth.users"
        TIMESTAMPTZ updated_at
    }

    SUPPORT_REQUESTS {
        UUID id PK
        UUID owner_id FK "References profiles.user_id"
        TEXT email
        TEXT subject
        TEXT message
        TEXT status "open, in_progress, resolved, closed"
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    AUDIT_LOGS {
        UUID id PK
        UUID actor_id FK "References auth.users"
        TEXT action
        TEXT target_type
        TEXT target_id
        JSONB metadata
        TIMESTAMPTZ created_at
    }
```

## Schema Relationships Explained

1. **User Identity & Profile (`auth.users` -> `profiles`)**:
   - Each authenticated Supabase user has a single corresponding profile created atomically via a PostgreSQL trigger `handle_new_user()`.
   - On signup, initial quota (20 image credits, 3 video credits) is safely assigned.

2. **Role-Based Access Control (`profiles` -> `user_roles`)**:
   - Roles include `user`, `admin`, and `super_admin`.
   - A normal user cannot modify their role. Only `super_admin` possesses permission to modify user role assignments.

3. **Workspace Organization (`profiles` -> `projects`)**:
   - Users can create multiple projects to organize generation jobs and media assets.

4. **Asynchronous Jobs (`generation_jobs` -> `media_assets`)**:
   - AI generation processes are recorded as `generation_jobs`.
   - Once a job transitions from `queued` / `processing` to `completed`, output artifacts are stored in private Supabase storage and indexed in `media_assets`.

5. **Quota Accounting & Idempotency (`profiles` -> `usage_transactions`)**:
   - Credit reservations and deductions are atomic using `deduct_user_credits()`.
   - Idempotency keys prevent duplicate deductions on retries or network interruptions.
   - If an AI provider returns an error, credits are automatically refunded.

6. **System Administration & Auditing (`app_settings`, `audit_logs`)**:
   - Administrative flags (maintenance mode, feature toggles, branding, credit limits) are protected by Row Level Security.
   - High-privilege administrative actions are recorded in `audit_logs`.
