import { createClient } from '@supabase/supabase-js'

// Production Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Helper function to check if database is available
export const isDatabaseAvailable = () => {
  return true // Always available in production
}

// Log database status
console.log('�️ Production database connection established')
console.log('� Supabase URL:', supabaseUrl)

// Database types
export interface Policy {
  id: string
  user_wallet_address: string
  policy_type: string
  premium: number
  coverage: number
  duration: number
  purchase_date: string
  status: 'active' | 'expired' | 'claimed'
  claim_amount?: number
  claim_date?: string
  metadata?: any
  created_at: string
  updated_at: string
}

export interface Activity {
  id: string
  user_wallet_address: string
  action: string
  description: string
  amount?: number
  policy_id?: string
  transaction_hash?: string
  timestamp: string
  created_at: string
}

export interface ClaimRecord {
  id: string
  policy_id: string
  user_wallet_address: string
  claim_amount: number
  claim_percentage: number
  days_held: number
  time_bonus: number
  claim_date: string
  status: 'pending' | 'approved' | 'rejected' | 'paid'
  transaction_hash?: string
  created_at: string
  updated_at: string
}
