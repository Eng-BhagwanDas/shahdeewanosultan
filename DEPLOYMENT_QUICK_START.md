# Quick Start: Supabase Migration

This guide will help you quickly set up Supabase for your ShahDeeewanoSultan project.

## Prerequisites
- A Supabase account (free tier is fine)
- Node.js and npm installed

## Quick Setup Steps

### 1. Create Supabase Project (5 minutes)

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Fill in:
   - **Name**: `shahdeewanosultan`
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
4. Click **"Create new project"** and wait 2-3 minutes

### 2. Get Your Credentials (1 minute)

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these three values:
   - **Project URL**
   - **anon public** key
   - **service_role** key (click "Reveal")

### 3. Update Environment Variables (1 minute)

Open your `.env` file and replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4. Create Database Tables (2 minutes)

1. In Supabase dashboard, click **SQL Editor**
2. Click **"New query"**
3. Open the file `supabase_schema.sql` in your project
4. Copy all contents and paste into the SQL editor
5. Click **"Run"** to create all tables

### 5. Start Your Application (1 minute)

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app!

## Verify Everything Works

1. Open [http://localhost:3000/admin](http://localhost:3000/admin)
2. Login with your admin credentials
3. Try creating a test entry in any section
4. Check Supabase dashboard → **Table Editor** to see the data

## What Changed?

✅ **Removed**: MySQL database and `mysql2` package  
✅ **Added**: Supabase (PostgreSQL) with `@supabase/supabase-js`  
✅ **Updated**: All API routes now use Supabase client  
✅ **Benefits**: Hosted database, no local MySQL needed, real-time features available

## Troubleshooting

**Error: "Invalid API key"**
- Double-check your `.env` file has correct credentials
- Restart dev server: `Ctrl+C` then `npm run dev`

**Tables not created**
- Make sure you ran the full `supabase_schema.sql` in SQL Editor
- Check for error messages in the SQL Editor

**Connection errors**
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check internet connection
- Ensure Supabase project is active

## Need Help?

See the detailed guide: `SUPABASE_SETUP_GUIDE.md`

---

**Total Setup Time**: ~10 minutes ⏱️
