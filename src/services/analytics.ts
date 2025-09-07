// Analytics API service for tracking user behavior and statistics

interface UserConnection {
  walletAddress: string;
  firstConnected: string;
  lastConnected: string;
  connectionCount: number;
  userAgent?: string;
  ipAddress?: string;
}

interface PolicyPurchase {
  id: string;
  walletAddress: string;
  policyType: string;
  premium: number;
  coverage: string;
  duration: string;
  totalPaid: number;
  platformFee: number;
  txHash: string;
  purchaseTimestamp: string;
  status: 'active' | 'claimed' | 'expired';
  coverageAmount: number;
}

interface UserAnalytics {
  walletAddress: string;
  totalPoliciesPurchased: number;
  totalAmountSpent: number;
  totalCoverageAmount: number;
  activePolicies: number;
  claimedPolicies: number;
  averagePolicyValue: number;
  firstPurchaseDate: string;
  lastPurchaseDate: string;
  favoriteePolicyType: string;
  riskScore: number;
}

interface GlobalAnalytics {
  totalUsers: number;
  totalConnections: number;
  totalPoliciesSold: number;
  totalRevenue: number;
  totalCoverageIssued: number;
  activePoliciesCount: number;
  claimedPoliciesCount: number;
  averagePolicyValue: number;
  topPolicyTypes: Array<{ type: string; count: number; revenue: number }>;
  userGrowthData: Array<{ date: string; newUsers: number; totalUsers: number }>;
  revenueData: Array<{ date: string; revenue: number; policies: number }>;
}

class AnalyticsService {
  private baseUrl: string;

  constructor() {
    // Use environment variable or default to localhost
    this.baseUrl = import.meta.env.VITE_ANALYTICS_API_URL || 'http://localhost:3001';
  }

  // Utility method for API calls
  private async apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Track wallet connection
  async trackWalletConnection(walletAddress: string, userAgent?: string): Promise<void> {
    try {
      await this.apiCall('/api/analytics/wallet-connection', {
        method: 'POST',
        body: JSON.stringify({
          walletAddress,
          timestamp: new Date().toISOString(),
          userAgent,
        }),
      });
      console.log('✅ Wallet connection tracked');
    } catch (error) {
      console.error('❌ Failed to track wallet connection:', error);
    }
  }

  // Track policy purchase
  async trackPolicyPurchase(policyData: Omit<PolicyPurchase, 'id' | 'purchaseTimestamp'>): Promise<void> {
    try {
      await this.apiCall('/api/analytics/policy-purchase', {
        method: 'POST',
        body: JSON.stringify({
          ...policyData,
          purchaseTimestamp: new Date().toISOString(),
        }),
      });
      console.log('✅ Policy purchase tracked');
    } catch (error) {
      console.error('❌ Failed to track policy purchase:', error);
    }
  }

  // Track policy claim
  async trackPolicyClaim(walletAddress: string, policyId: string, claimAmount: number, txHash: string): Promise<void> {
    try {
      await this.apiCall('/api/analytics/policy-claim', {
        method: 'POST',
        body: JSON.stringify({
          walletAddress,
          policyId,
          claimAmount,
          txHash,
          claimTimestamp: new Date().toISOString(),
        }),
      });
      console.log('✅ Policy claim tracked');
    } catch (error) {
      console.error('❌ Failed to track policy claim:', error);
    }
  }

  // Get user analytics
  async getUserAnalytics(walletAddress: string): Promise<UserAnalytics> {
    return this.apiCall<UserAnalytics>(`/api/analytics/user/${walletAddress}`);
  }

  // Get global analytics
  async getGlobalAnalytics(): Promise<GlobalAnalytics> {
    return this.apiCall<GlobalAnalytics>('/api/analytics/global');
  }

  // Get user connection history
  async getUserConnections(walletAddress: string): Promise<UserConnection[]> {
    return this.apiCall<UserConnection[]>(`/api/analytics/connections/${walletAddress}`);
  }

  // Get user purchase history
  async getUserPurchases(walletAddress: string): Promise<{ purchases: PolicyPurchase[], total: number, totalPages: number, currentPage: number }> {
    return this.apiCall<{ purchases: PolicyPurchase[], total: number, totalPages: number, currentPage: number }>(`/api/analytics/purchases/${walletAddress}`);
  }

  // Get all connected users (admin endpoint)
  async getAllConnectedUsers(): Promise<UserConnection[]> {
    return this.apiCall<UserConnection[]>('/api/analytics/all-users');
  }

  // Get revenue analytics
  async getRevenueAnalytics(timeframe: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<any> {
    return this.apiCall(`/api/analytics/revenue?timeframe=${timeframe}`);
  }

  // Get policy type analytics
  async getPolicyTypeAnalytics(): Promise<any> {
    return this.apiCall('/api/analytics/policy-types');
  }

  // Get user growth analytics
  async getUserGrowthAnalytics(timeframe: 'day' | 'week' | 'month' = 'day'): Promise<any> {
    return this.apiCall(`/api/analytics/user-growth?timeframe=${timeframe}`);
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();

// Export types for use in other files
export type {
  UserConnection,
  PolicyPurchase,
  UserAnalytics,
  GlobalAnalytics,
};
