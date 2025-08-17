-- Zenith Policy Guard Database Schema
-- This SQL script creates the necessary tables for the insurance DApp

-- Enable Row Level Security
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================== POLICIES TABLE ==================
CREATE TABLE policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_wallet_address VARCHAR(42) NOT NULL,
  policy_type VARCHAR(100) NOT NULL,
  premium DECIMAL(18, 6) NOT NULL,
  coverage DECIMAL(18, 6) NOT NULL,
  duration INTEGER NOT NULL DEFAULT 365, -- days
  purchase_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'claimed')),
  claim_amount DECIMAL(18, 6),
  claim_date TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for policies table
CREATE INDEX idx_policies_wallet_address ON policies(user_wallet_address);
CREATE INDEX idx_policies_status ON policies(status);
CREATE INDEX idx_policies_purchase_date ON policies(purchase_date);
CREATE INDEX idx_policies_policy_type ON policies(policy_type);

-- ================== CLAIM RECORDS TABLE ==================
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

-- Indexes for claim_records table
CREATE INDEX idx_claim_records_policy_id ON claim_records(policy_id);
CREATE INDEX idx_claim_records_wallet_address ON claim_records(user_wallet_address);
CREATE INDEX idx_claim_records_status ON claim_records(status);
CREATE INDEX idx_claim_records_claim_date ON claim_records(claim_date);

-- ================== ACTIVITIES TABLE ==================
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

-- Indexes for activities table
CREATE INDEX idx_activities_wallet_address ON activities(user_wallet_address);
CREATE INDEX idx_activities_action ON activities(action);
CREATE INDEX idx_activities_timestamp ON activities(timestamp);
CREATE INDEX idx_activities_policy_id ON activities(policy_id);

-- ================== FUNCTIONS AND TRIGGERS ==================

-- Function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_policies_updated_at 
  BEFORE UPDATE ON policies 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_claim_records_updated_at 
  BEFORE UPDATE ON claim_records 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================== ROW LEVEL SECURITY POLICIES ==================

-- Enable RLS on all tables
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only see their own policies
CREATE POLICY "Users can view their own policies" ON policies
  FOR SELECT USING (user_wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can insert their own policies" ON policies
  FOR INSERT WITH CHECK (user_wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can update their own policies" ON policies
  FOR UPDATE USING (user_wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- Claim Records: Users can only see their own claim records
CREATE POLICY "Users can view their own claim records" ON claim_records
  FOR SELECT USING (user_wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can insert their own claim records" ON claim_records
  FOR INSERT WITH CHECK (user_wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- Activities: Users can only see their own activities
CREATE POLICY "Users can view their own activities" ON activities
  FOR SELECT USING (user_wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can insert their own activities" ON activities
  FOR INSERT WITH CHECK (user_wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- ================== VIEWS FOR ANALYTICS ==================

-- View for policy analytics
CREATE VIEW policy_analytics AS
SELECT 
  user_wallet_address,
  COUNT(*) as total_policies,
  COUNT(*) FILTER (WHERE status = 'active') as active_policies,
  COUNT(*) FILTER (WHERE status = 'claimed') as claimed_policies,
  COUNT(*) FILTER (WHERE status = 'expired') as expired_policies,
  SUM(premium) as total_premium_paid,
  SUM(claim_amount) FILTER (WHERE status = 'claimed') as total_claimed,
  AVG(premium) as average_premium,
  MIN(purchase_date) as first_policy_date,
  MAX(purchase_date) as latest_policy_date
FROM policies
GROUP BY user_wallet_address;

-- View for claim performance
CREATE VIEW claim_performance AS
SELECT 
  cr.user_wallet_address,
  cr.policy_id,
  p.policy_type,
  p.premium,
  cr.claim_amount,
  cr.claim_percentage,
  cr.days_held,
  cr.time_bonus,
  (cr.claim_amount - p.premium) as profit_loss,
  ((cr.claim_amount - p.premium) / p.premium * 100) as roi_percentage
FROM claim_records cr
JOIN policies p ON cr.policy_id = p.id
WHERE cr.status = 'approved';

-- ================== SAMPLE DATA (OPTIONAL) ==================

-- Insert sample policies for testing
INSERT INTO policies (user_wallet_address, policy_type, premium, coverage, purchase_date) VALUES
('0x1234567890123456789012345678901234567890', 'Device Protection', 0.5, 500, NOW() - INTERVAL '30 days'),
('0x1234567890123456789012345678901234567890', 'Travel Insurance', 2.0, 2500, NOW() - INTERVAL '180 days'),
('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', 'Smart Contract Cover', 5.0, 10000, NOW() - INTERVAL '365 days');

-- Insert sample activities
INSERT INTO activities (user_wallet_address, action, description, amount, timestamp) VALUES
('0x1234567890123456789012345678901234567890', 'policy_purchase', 'Purchased Device Protection policy for 0.5 SHM', 0.5, NOW() - INTERVAL '30 days'),
('0x1234567890123456789012345678901234567890', 'policy_purchase', 'Purchased Travel Insurance policy for 2.0 SHM', 2.0, NOW() - INTERVAL '180 days'),
('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', 'policy_purchase', 'Purchased Smart Contract Cover policy for 5.0 SHM', 5.0, NOW() - INTERVAL '365 days');

-- ================== COMMENTS ==================

COMMENT ON TABLE policies IS 'Insurance policies purchased by users';
COMMENT ON TABLE claim_records IS 'Records of all claims made by users with time-based calculations';
COMMENT ON TABLE activities IS 'Activity feed for user actions and system events';

COMMENT ON COLUMN policies.premium IS 'Premium paid in SHM tokens';
COMMENT ON COLUMN policies.coverage IS 'Coverage amount in SHM tokens';
COMMENT ON COLUMN policies.duration IS 'Policy duration in days';
COMMENT ON COLUMN claim_records.claim_percentage IS 'Base claim percentage based on time held';
COMMENT ON COLUMN claim_records.time_bonus IS 'Additional time bonus percentage';
COMMENT ON COLUMN claim_records.days_held IS 'Number of days policy was held before claiming';
