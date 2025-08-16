-- Create activity_feed table for real-time insurance activity tracking
CREATE TABLE activity_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('policy_purchase', 'policy_claim', 'payment', 'kyc', 'underwriting', 'risk_assessment')),
  message TEXT NOT NULL,
  user_address TEXT NOT NULL,
  amount TEXT, -- SHM amount as string to preserve precision
  transaction_hash TEXT,
  policy_type TEXT,
  metadata JSONB,
  status TEXT NOT NULL CHECK (status IN ('success', 'pending', 'failed')) DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_activity_feed_created_at ON activity_feed(created_at DESC);
CREATE INDEX idx_activity_feed_user_address ON activity_feed(user_address);
CREATE INDEX idx_activity_feed_type ON activity_feed(type);

-- Enable Row Level Security (RLS)
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all users to read activities (public feed)
CREATE POLICY "Allow public read access to activity feed" ON activity_feed
  FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert activities
CREATE POLICY "Allow authenticated users to insert activities" ON activity_feed
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Create a view for recent activities with formatted timestamps
CREATE VIEW recent_activities AS
SELECT 
  id,
  type,
  message,
  user_address,
  amount,
  transaction_hash,
  policy_type,
  metadata,
  status,
  created_at,
  CASE 
    WHEN created_at > NOW() - INTERVAL '1 minute' THEN 'just now'
    WHEN created_at > NOW() - INTERVAL '1 hour' THEN 
      EXTRACT(EPOCH FROM (NOW() - created_at))/60 || ' minutes ago'
    WHEN created_at > NOW() - INTERVAL '1 day' THEN 
      EXTRACT(EPOCH FROM (NOW() - created_at))/3600 || ' hours ago'
    ELSE 
      EXTRACT(EPOCH FROM (NOW() - created_at))/86400 || ' days ago'
  END as time_ago
FROM activity_feed
ORDER BY created_at DESC;

-- Insert some sample data for testing
INSERT INTO activity_feed (type, message, user_address, amount, policy_type, status) VALUES
('policy_purchase', 'Device protection policy purchased for 0.5 SHM', '0x742d35Cc6634C0532925a3b8D46A6D1234567890', '0.5', 'Device Protection', 'success'),
('payment', 'Premium payment of 0.5 SHM received', '0x742d35Cc6634C0532925a3b8D46A6D1234567890', '0.5', null, 'success'),
('policy_claim', 'Travel insurance claim approved for 2.0 SHM', '0xAbCdEf1234567890123456789012345678901234', '2.0', 'Travel Insurance', 'success'),
('kyc', 'KYC verification completed for user 0x4a2b...', '0x4a2b35Cc6634C0532925a3b8D46A6D1234567890', null, null, 'success'),
('risk_assessment', 'Risk assessment completed for event coverage', '0x1234567890123456789012345678901234567890', null, 'Event Coverage', 'success');
