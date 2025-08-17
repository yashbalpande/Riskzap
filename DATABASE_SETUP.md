# Zenith Policy Guard - Database Setup Guide

## Supabase Setup Instructions

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: zenith-policy-guard
   - **Database Password**: Choose a secure password
   - **Region**: Select closest to your users
5. Click "Create new project"

### 2. Get Project Credentials
After project creation, you'll find:
- **Project URL**: `https://your-project-ref.supabase.co`
- **API Keys**: In Settings > API
  - `anon` key (safe for frontend)
  - `service_role` key (keep secret)

### 3. Configure Environment Variables
Update your `.env.local` file with the actual credentials:

```bash
VITE_SUPABASE_URL=https://duklcvhtxmfzaiihsytw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_DEMO_MODE=false
NODE_ENV=production
```

### 4. Create Database Schema
In Supabase Dashboard:
1. Go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the schema from `database/schema.sql`
4. Click **Run** to execute

### 5. Verify Setup
- Check **Table Editor** to see created tables:
  - `policies`
  - `claim_records` 
  - `activities`
- Check **Authentication** settings if needed
- Test API connection from your app

### 6. Row Level Security (Optional)
The schema includes RLS policies. To enable:
1. Go to **Authentication** > **Policies**
2. Enable RLS on all tables
3. Policies are already defined in schema

### Production Checklist
- ✅ Supabase project created
- ✅ Environment variables configured
- ✅ Database schema deployed
- ✅ Tables visible in dashboard
- ✅ Demo mode disabled
- ✅ Real transactions enabled

## Real Transaction Features Enabled

### 🚀 What's Now Live:
- **Real Database Storage**: All policies stored in PostgreSQL
- **Blockchain Transactions**: Actual SHM token transfers
- **Time-Based Claims**: Progressive rewards (0.5% → 100%+)
- **KYC Verification**: Production-ready identity validation
- **Activity Logging**: Complete audit trail
- **Portfolio Analytics**: Real-time calculations

### 🔄 No More Demo Mode:
- ❌ Simulated transactions removed
- ❌ localStorage fallbacks removed
- ❌ Demo banners removed
- ✅ Real blockchain interactions
- ✅ Production database only
- ✅ Actual token transfers

### Support
If you encounter issues:
1. Check Supabase project status
2. Verify environment variables
3. Check browser console for errors
4. Review database logs in Supabase dashboard
