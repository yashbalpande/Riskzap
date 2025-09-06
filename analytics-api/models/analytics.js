import mongoose from 'mongoose';

// User Connection Schema
const userConnectionSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    index: true,
    lowercase: true
  },
  firstConnected: {
    type: Date,
    default: Date.now
  },
  lastConnected: {
    type: Date,
    default: Date.now
  },
  connectionCount: {
    type: Number,
    default: 1
  },
  userAgent: String,
  ipAddress: String,
  sessionData: [{
    timestamp: { type: Date, default: Date.now },
    userAgent: String,
    ipAddress: String
  }]
}, {
  timestamps: true,
  collection: 'userConnections'
});

// Policy Purchase Schema
const policyPurchaseSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    index: true,
    lowercase: true
  },
  policyType: {
    type: String,
    required: true,
    enum: ['health', 'auto', 'travel', 'life', 'property', 'crypto']
  },
  premium: {
    type: Number,
    required: true,
    min: 0
  },
  coverage: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true,
    enum: ['5 days', '30 days', '120 days', '365 days', '365+ days']
  },
  totalPaid: {
    type: Number,
    required: true,
    min: 0
  },
  platformFee: {
    type: Number,
    required: true,
    min: 0
  },
  txHash: {
    type: String,
    required: true,
    unique: true
  },
  purchaseTimestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'claimed', 'expired'],
    default: 'active'
  },
  coverageAmount: {
    type: Number,
    required: true,
    min: 0
  },
  riskScore: {
    type: Number,
    min: 0,
    max: 100
  }
}, {
  timestamps: true,
  collection: 'policyPurchases'
});

// Policy Claim Schema
const policyClaimSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    index: true,
    lowercase: true
  },
  policyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PolicyPurchase',
    required: true
  },
  claimAmount: {
    type: Number,
    required: true,
    min: 0
  },
  txHash: {
    type: String,
    required: true,
    unique: true
  },
  claimTimestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'paid'],
    default: 'pending'
  },
  reason: String,
  documentation: [String]
}, {
  timestamps: true,
  collection: 'policyClaims'
});

// Daily Analytics Schema (for aggregated data)
const dailyAnalyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  newUsers: {
    type: Number,
    default: 0
  },
  totalUsers: {
    type: Number,
    default: 0
  },
  newPolicies: {
    type: Number,
    default: 0
  },
  totalPolicies: {
    type: Number,
    default: 0
  },
  dailyRevenue: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  averagePolicyValue: {
    type: Number,
    default: 0
  },
  topPolicyTypes: [{
    type: { type: String },
    count: Number,
    revenue: Number
  }]
}, {
  timestamps: true,
  collection: 'dailyAnalytics'
});

// Indexes for better query performance
userConnectionSchema.index({ walletAddress: 1, lastConnected: -1 });
policyPurchaseSchema.index({ walletAddress: 1, purchaseTimestamp: -1 });
policyPurchaseSchema.index({ policyType: 1, purchaseTimestamp: -1 });
policyPurchaseSchema.index({ status: 1, purchaseTimestamp: -1 });
policyClaimSchema.index({ walletAddress: 1, claimTimestamp: -1 });
dailyAnalyticsSchema.index({ date: -1 });

// Create models
export const UserConnection = mongoose.model('UserConnection', userConnectionSchema);
export const PolicyPurchase = mongoose.model('PolicyPurchase', policyPurchaseSchema);
export const PolicyClaim = mongoose.model('PolicyClaim', policyClaimSchema);
export const DailyAnalytics = mongoose.model('DailyAnalytics', dailyAnalyticsSchema);
