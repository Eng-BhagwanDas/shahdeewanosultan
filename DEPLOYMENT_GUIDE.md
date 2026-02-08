# Supabase Deployment Guide

Complete guide for deploying the ShahDeeewanoSultan application with Supabase.

## Table of Contents
1. [Overview](#overview)
2. [Supabase Setup](#supabase-setup)
3. [Local Development](#local-development)
4. [Production Deployment](#production-deployment)
5. [Database Management](#database-management)
6. [Troubleshooting](#troubleshooting)

## Overview

This application now uses **Supabase** (PostgreSQL) instead of MySQL. Supabase provides:
- ✅ Hosted PostgreSQL database
- ✅ Auto-generated REST API
- ✅ Real-time subscriptions
- ✅ Built-in authentication (ready to use)
- ✅ File storage (for images, PDFs, audio)
- ✅ Web-based dashboard

### Migration Summary
- **Removed**: MySQL, `mysql2` package, local database server
- **Added**: Supabase, `@supabase/supabase-js` package
- **Updated**: All API routes, environment variables

---

## Supabase Setup

### Step 1: Create Account
1. Visit [https://supabase.com](https://supabase.com)
2. Sign up with GitHub, Google, or email
3. Verify your email if required

### Step 2: Create Project
1. Click **"New Project"**
2. Select your organization (or create one)
3. Configure project:
   ```
   Name: shahdeewanosultan
   Database Password: [Create strong password - SAVE THIS!]
   Region: [Choose closest to your users]
   Pricing Plan: Free (or Pro for production)
   ```
4. Click **"Create new project"**
5. Wait 2-3 minutes for provisioning

### Step 3: Get API Credentials
1. Go to **Settings** (⚙️ icon) → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbGc...` (public key)
   - **service_role**: `eyJhbGc...` (click "Reveal" - keep secret!)

### Step 4: Create Database Schema
1. Click **SQL Editor** in sidebar
2. Click **"New query"**
3. Copy contents of `supabase_schema.sql`
4. Paste into editor
5. Click **"Run"** (or press Ctrl+Enter)
6. Verify success message

### Step 5: Verify Tables
1. Click **Table Editor** in sidebar
2. You should see 10 tables:
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

---

## Local Development

### Environment Setup

1. **Update `.env` file**:
   ```env
   CORS_ORIGINS=*
   
   ADMIN_USERNAME=sdsadmin
   ADMIN_PASSWORD=sds*
   
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Access application**:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

### Testing Locally

1. **Test Admin Panel**:
   - Login at `/admin/login`
   - Try creating/editing/deleting items
   - Check Supabase Table Editor to verify data

2. **Test Public Pages**:
   - Visit `/saints`, `/books`, `/audio`, etc.
   - Verify data displays correctly

3. **Check Console**:
   - Open browser DevTools (F12)
   - Look for errors in Console tab
   - Check Network tab for API calls

---

## Production Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Migrated to Supabase"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click **"New Project"**
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Next.js
     - **Root Directory**: `./`
     - **Build Command**: `npm run build`
     - **Output Directory**: `.next`

3. **Add Environment Variables**:
   In Vercel project settings → Environment Variables, add:
   ```
   CORS_ORIGINS=*
   ADMIN_USERNAME=sdsadmin
   ADMIN_PASSWORD=[your-secure-password]
   NEXT_PUBLIC_SUPABASE_URL=[your-supabase-url]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
   SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
   ```

4. **Deploy**:
   - Click **"Deploy"**
   - Wait for build to complete
   - Visit your production URL

### Other Platforms

#### Netlify
- Similar to Vercel
- Add environment variables in Site Settings
- Build command: `npm run build`
- Publish directory: `.next`

#### Railway
- Connect GitHub repository
- Add environment variables
- Railway auto-detects Next.js

#### Self-Hosted
```bash
npm run build
npm start
```
Set environment variables on your server.

---

## Database Management

### Viewing Data
1. Go to Supabase dashboard
2. Click **Table Editor**
3. Select table to view/edit data
4. Use filters and search

### Backing Up Data
1. Go to **Database** → **Backups**
2. Click **"Create backup"**
3. Download backup file

### Exporting Data
```sql
-- In SQL Editor, run:
COPY (SELECT * FROM saints) TO STDOUT WITH CSV HEADER;
```

### Importing Data
1. Go to **Table Editor**
2. Select table
3. Click **"Insert"** → **"Import data"**
4. Upload CSV file

### Running SQL Queries
1. Click **SQL Editor**
2. Write your query
3. Click **"Run"**

Example queries:
```sql
-- Count all saints
SELECT COUNT(*) FROM saints;

-- Get all English books
SELECT * FROM books WHERE language = 'en';

-- Delete test data
DELETE FROM slider WHERE title LIKE '%test%';
```

---

## Troubleshooting

### Common Issues

#### 1. "Invalid API key" Error
**Cause**: Wrong credentials in `.env`  
**Fix**:
- Verify credentials in Supabase Settings → API
- Copy full keys (they're very long!)
- Restart dev server after updating `.env`

#### 2. "relation does not exist" Error
**Cause**: Tables not created  
**Fix**:
- Run `supabase_schema.sql` in SQL Editor
- Check for error messages
- Verify you're in the correct project

#### 3. CORS Errors
**Cause**: Supabase URL not in allowed origins  
**Fix**:
- In Supabase: Settings → API → CORS
- Add your domain (e.g., `https://yourdomain.com`)
- For development, `http://localhost:3000` should work

#### 4. "No rows returned" for Existing Data
**Cause**: Empty database  
**Fix**:
- Add data via admin panel
- Or import data from backup

#### 5. Slow Queries
**Cause**: Missing indexes  
**Fix**:
- Indexes are created by `supabase_schema.sql`
- Check in Database → Indexes
- Add custom indexes if needed

### Getting Help

1. **Supabase Documentation**: [https://supabase.com/docs](https://supabase.com/docs)
2. **Supabase Discord**: [https://discord.supabase.com](https://discord.supabase.com)
3. **Check Logs**:
   - Supabase: Database → Logs
   - Vercel: Deployment → Functions
   - Browser: DevTools Console

---

## Advanced Features

### Enable Real-time (Optional)
```javascript
// In your component
import { useEffect, useState } from 'react';
import supabase from '@/lib/supabase';

function LiveSaints() {
  const [saints, setSaints] = useState([]);

  useEffect(() => {
    // Subscribe to changes
    const subscription = supabase
      .channel('saints-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'saints' },
        (payload) => {
          console.log('Change received!', payload);
          // Update state
        }
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }, []);
}
```

### File Storage (Optional)
Supabase includes file storage for images, PDFs, audio:

1. Go to **Storage** in Supabase dashboard
2. Create bucket (e.g., `media`)
3. Set permissions
4. Upload files via API or dashboard

### Row Level Security (RLS)
Already configured in schema with permissive policies.  
To restrict access:
1. Go to **Authentication** → **Policies**
2. Edit policies for each table
3. Add conditions (e.g., only admins can delete)

---

## Migration Checklist

- [x] Created Supabase project
- [x] Ran database schema
- [x] Updated environment variables
- [x] Installed Supabase client
- [x] Migrated API routes
- [x] Tested locally
- [ ] Deployed to production
- [ ] Verified production deployment
- [ ] Set up backups

---

## Support

For issues specific to this application, check:
- `SUPABASE_SETUP_GUIDE.md` - Detailed setup instructions
- `DEPLOYMENT_QUICK_START.md` - Quick reference guide
- `supabase_schema.sql` - Database schema

**Happy deploying! 🚀**
