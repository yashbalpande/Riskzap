import { supabase } from '@/integrations/supabase/client';
import type { ActivityFeedItem } from '@/types/activities';

export class ActivityService {
  /**
   * Add a new activity to the feed (localStorage version for now)
   */
  static async addActivity(activity: Omit<ActivityFeedItem, 'id' | 'created_at'>) {
    try {
      const activityWithId = {
        ...activity,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString()
      };

      const existing = JSON.parse(localStorage.getItem('activity_feed') || '[]');
      const updated = [activityWithId, ...existing].slice(0, 50); // Keep only last 50
      localStorage.setItem('activity_feed', JSON.stringify(updated));
      
      // Trigger custom event for real-time updates
      window.dispatchEvent(new CustomEvent('activity_feed_update', { detail: updated }));
      
      return activityWithId;
    } catch (error) {
      console.error('Activity service error:', error);
      return null;
    }
  }

  /**
   * Get recent activities for the feed
   */
  static async getRecentActivities(limit = 10) {
    try {
      const activities = JSON.parse(localStorage.getItem('activity_feed') || '[]');
      
      // Clear any sample data (activities without real transaction hashes)
      const realActivities = activities.filter((activity: any) => 
        activity.transaction_hash || activity.type === 'kyc' || activity.type === 'risk_assessment'
      );
      
      // Update localStorage if we filtered out sample data
      if (realActivities.length !== activities.length) {
        localStorage.setItem('activity_feed', JSON.stringify(realActivities));
      }
      
      return realActivities.slice(0, limit);
    } catch (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
  }

  /**
   * Subscribe to real-time activity updates
   */
  static subscribeToActivities(callback: (activities: ActivityFeedItem[]) => void) {
    const handleUpdate = (event: CustomEvent) => {
      callback(event.detail);
    };

    window.addEventListener('activity_feed_update', handleUpdate as EventListener);

    // Return unsubscribe function
    return () => {
      window.removeEventListener('activity_feed_update', handleUpdate as EventListener);
    };
  }

  /**
   * Log policy purchase activity
   */
  static async logPolicyPurchase(
    userAddress: string,
    policyType: string,
    amount: string,
    transactionHash?: string
  ) {
    return this.addActivity({
      type: 'policy_purchase',
      message: `${policyType} policy purchased for ${amount} SHM`,
      user_address: userAddress,
      amount,
      transaction_hash: transactionHash,
      policy_type: policyType,
      status: 'success'
    });
  }

  /**
   * Log policy claim activity
   */
  static async logPolicyClaim(
    userAddress: string,
    policyType: string,
    amount: string,
    transactionHash?: string
  ) {
    return this.addActivity({
      type: 'policy_claim',
      message: `${policyType} insurance claim approved for ${amount} SHM`,
      user_address: userAddress,
      amount,
      transaction_hash: transactionHash,
      policy_type: policyType,
      status: 'success'
    });
  }

  /**
   * Log payment activity
   */
  static async logPayment(
    userAddress: string,
    amount: string,
    transactionHash?: string
  ) {
    return this.addActivity({
      type: 'payment',
      message: `Premium payment of ${amount} SHM received`,
      user_address: userAddress,
      amount,
      transaction_hash: transactionHash,
      status: 'success'
    });
  }

  /**
   * Log KYC verification
   */
  static async logKYCVerification(userAddress: string) {
    return this.addActivity({
      type: 'kyc',
      message: `KYC verification completed for user ${userAddress.slice(0, 6)}...`,
      user_address: userAddress,
      status: 'success'
    });
  }

  /**
   * Log risk assessment with more details
   */
  static async logRiskAssessment(userAddress: string, policyType: string, details?: string) {
    const message = details 
      ? `${details} completed for ${policyType}`
      : `Risk assessment completed for ${policyType} coverage`;
      
    return this.addActivity({
      type: 'risk_assessment',
      message,
      user_address: userAddress,
      policy_type: policyType,
      status: 'success'
    });
  }

  /**
   * Log underwriting activity
   */
  static async logUnderwritingActivity(userAddress: string, riskScore: string, recommendedPremium: string) {
    return this.addActivity({
      type: 'underwriting',
      message: `AI underwriting completed - Risk Score: ${riskScore}, Premium: ${recommendedPremium} SHM`,
      user_address: userAddress,
      amount: recommendedPremium,
      metadata: { riskScore, type: 'ai_assessment' },
      status: 'success'
    });
  }

  /**
   * Log policy creation initiation
   */
  static async logPolicyCreation(userAddress: string, policyType: string) {
    return this.addActivity({
      type: 'policy_purchase',
      message: `${policyType} policy creation initiated`,
      user_address: userAddress,
      policy_type: policyType,
      status: 'pending'
    });
  }
}
