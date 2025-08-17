# 🚨 URGENT: Database Setup Required

## The Error You're Seeing
```
Failed to fetch policies: Could not find the table 'public.policies' in the schema cache
```

This means the database tables haven't been created in your Supabase project yet.

## Quick Fix - Execute Database Schema

### Step 1: Go to Supabase Dashboard
1. Open [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: `duklcvhtxmfzaiihsytw` duklcvhtxmfzaiihsytw

### Step 2: Open SQL Editor
1. Click **SQL Editor** in the left sidebar
2. Click **New Query**

### Step 3: Execute the Schema
Copy the entire contents of `database/schema.sql` and paste it into the SQL editor, then click **RUN**.

Or use this shortened version to get started quickly:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create policies table
CREATE TABLE policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_wallet_address VARCHAR(42) NOT NULL,
  policy_type VARCHAR(100) NOT NULL,
  premium DECIMAL(18, 6) NOT NULL,
  coverage DECIMAL(18, 6) NOT NULL,
  duration INTEGER NOT NULL DEFAULT 365,
  purchase_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'claimed')),
  claim_amount DECIMAL(18, 6),
  claim_date TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create claim_records table
CREATE TABLE claim_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  policy_id UUID NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
  user_wallet_address VARCHAR(42) NOT NULL,
  claim_amount DECIMAL(18, 6) NOT NULL,
  claim_percentage DECIMAL(5, 2) NOT NULL,
  days_held INTEGER NOT NULL,
  time_bonus DECIMAL(5, 2) NOT NULL DEFAULT 0,
  claim_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paid')),
  transaction_hash VARCHAR(66),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create activities table
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_wallet_address VARCHAR(42) NOT NULL,
  action VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(18, 6),
  policy_id UUID REFERENCES policies(id) ON DELETE SET NULL,
  transaction_hash VARCHAR(66),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_policies_wallet_address ON policies(user_wallet_address);
CREATE INDEX idx_policies_status ON policies(status);
CREATE INDEX idx_claim_records_policy_id ON claim_records(policy_id);
CREATE INDEX idx_claim_records_wallet_address ON claim_records(user_wallet_address);
CREATE INDEX idx_activities_wallet_address ON activities(user_wallet_address);
CREATE INDEX idx_activities_timestamp ON activities(timestamp);
```

### Step 4: Verify Tables Created
1. Go to **Table Editor**
2. You should see three tables:
   - `policies`
   - `claim_records` 
   - `activities`

### Step 5: Test the Application
After creating the tables, try purchasing and claiming policies again.

## Alternative: Temporary Fallback
If you can't set up the database right now, I can temporarily add localStorage fallback for testing.
