# Flow AI Studio — Deployment Guide (Netlify & Supabase)

This guide provides step-by-step instructions for deploying Flow AI Studio to production using Supabase for database, authentication, and storage, and Netlify for frontend hosting.

---

## Part 1: Supabase Setup (Database & Auth)

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New Project**, select an organization, and choose a region close to your users.
3. Save your database password securely.

### 2. Run Database Migrations
1. In the Supabase Dashboard, navigate to **SQL Editor**.
2. Open `supabase/migrations/20261014000000_flow_ai_schema.sql` from this project.
3. Paste the entire SQL script and click **Run**.
4. Confirm all 10 tables, triggers, indexes, and RLS policies are created successfully.

### 3. Configure Supabase Storage
1. Navigate to **Storage** -> **Create new bucket**.
2. Bucket name: `user-assets`.
3. Set bucket to **Private** (authenticated users only).
4. Apply storage policies:
   - **SELECT**: `auth.uid() = (storage.foldername(name))[1]::uuid`
   - **INSERT**: `auth.uid() = (storage.foldername(name))[1]::uuid`
   - **DELETE**: `auth.uid() = (storage.foldername(name))[1]::uuid`

### 4. Create Initial Super Admin
To assign the first Super Admin safely:
1. Sign up on your Flow AI Studio website with your administrative email.
2. In Supabase Dashboard -> **SQL Editor**, execute:
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   VALUES (
     (SELECT id FROM auth.users WHERE email = 'your-admin@example.com'),
     'super_admin'
   )
   ON CONFLICT (user_id, role) DO NOTHING;
   ```

---

## Part 2: Netlify Deployment (Frontend)

### 1. Build Verification
Locally verify the frontend build:
```bash
npm.cmd run build
```
Ensure the `dist/` directory generates with zero errors.

### 2. Configure SPA Redirects
Create a `public/_redirects` file with the rule:
```text
/*    /index.html   200
```
This ensures React Router routes (such as `/dashboard`, `/admin`, `/photo-editor`) resolve cleanly upon page refresh.

### 3. Deploy via Netlify CLI or Git
#### Option A: Netlify Git Integration (Recommended)
1. Push this repository to GitHub.
2. Go to [netlify.com](https://netlify.com) -> **Add new site** -> **Import an existing project**.
3. Connect your GitHub repository.
4. Set Build Settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Set Environment Variables in Netlify (Site configuration -> Environment variables):
   - `VITE_SUPABASE_URL`: `https://your-project.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `your-anon-key`
6. Click **Deploy Site**.

#### Option B: Netlify CLI Manual Deploy
```bash
npx netlify-cli deploy --prod --dir=dist
```

---

## Part 3: Deploying Supabase Edge Functions (Optional for live AI calls)

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```
2. Link your local project:
   ```bash
   supabase link --project-ref your-project-ref
   ```
3. Set your server-side AI provider API keys:
   ```bash
   supabase secrets set OPENAI_API_KEY=sk-...
   supabase secrets set STABILITY_API_KEY=sk-...
   ```
4. Deploy edge functions:
   ```bash
   supabase functions deploy generate-image
   supabase functions deploy generate-video
   ```

---

## Part 4: Verification Checklist

- [x] Landing page loads with dark futuristic styling and smooth responsiveness.
- [x] User registration bootstraps profile with 20 image & 3 video credits.
- [x] Canvas photo editor loads image, executes adjustments, crops, and exports file.
- [x] Video editor trims time, displays live playback, and overlays text.
- [x] My Creations stores items and filters images/videos.
- [x] Admin and Super Admin dashboards enforce role-based access restrictions.
