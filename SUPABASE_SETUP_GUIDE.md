# Supabase Setup Guide

Follow these steps to set up your Supabase project for the ShahDeeewanoSultan application.

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign Up"**
3. Sign up using:
   - GitHub account (recommended)
   - Google account
   - Email/password

## Step 2: Create a New Project

1. After signing in, click **"New Project"**
2. Fill in the project details:
   - **Name**: `shahdeewanosultan` (or any name you prefer)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Select the closest region to your users
   - **Pricing Plan**: Select **Free** tier (perfect for development)
3. Click **"Create new project"**
4. Wait 2-3 minutes for the project to be provisioned

## Step 3: Get Your API Credentials

Once your project is ready:

1. Go to **Settings** (gear icon in sidebar)
2. Click **API** in the settings menu
3. You'll see your credentials:

   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   anon public: eyJhbGc...
   service_role: eyJhbGc... (click "Reveal" to see)
   ```

4. **Copy these values** - you'll need them in the next step

## Step 4: Update Your .env File

Open your `.env` file and replace the MySQL configuration with:

```env
CORS_ORIGINS=*

ADMIN_USERNAME=sdsadmin
ADMIN_PASSWORD=sds*

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key...
```

> [!IMPORTANT]
> Replace the placeholder values with your actual Supabase credentials from Step 3.

## Step 5: Create Database Tables

1. In your Supabase dashboard, click **SQL Editor** in the sidebar
2. Click **"New query"**
3. Copy the contents of `supabase_schema.sql` (I'll create this file)
4. Paste it into the SQL editor
5. Click **"Run"** to execute the schema
6. You should see "Success. No rows returned" message

## Step 6: Verify Database Setup

1. Click **Table Editor** in the sidebar
2. You should see all your tables:
   - slider
   - saints
   - books
   - audio
   - videos
   - events
   - news
   - gallery
   - poetry
   - content

## Step 7: Install Dependencies

Run this command in your project directory:

```bash
npm install @supabase/supabase-js
npm uninstall mysql2
```

## Step 8: Test the Application

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000)

3. Test the admin panel at [http://localhost:3000/admin](http://localhost:3000/admin)

## Troubleshooting

### "Invalid API key" error
- Double-check your `.env` file has the correct credentials
- Make sure you copied the full key (they're very long!)
- Restart your dev server after updating `.env`

### Tables not showing in Supabase
- Make sure you ran the SQL schema in the SQL Editor
- Check for any error messages in the SQL Editor
- Verify you're looking at the correct project

### Connection errors
- Verify your `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check your internet connection
- Ensure the Supabase project is active (not paused)

## Next Steps

Once setup is complete:
1. ✅ Supabase project created
2. ✅ Database schema created
3. ✅ Environment variables configured
4. ✅ Dependencies installed
5. ✅ Application running successfully

You're ready to start using Supabase! 🎉
