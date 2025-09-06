import express from 'express';
import { UserConnection, PolicyPurchase, PolicyClaim, DailyAnalytics } from '../models/analytics.js';

const router = express.Router();

// Track wallet connection
router.post('/wallet-connection', async (req, res) => {
  try {
    const { walletAddress, timestamp, userAgent, ipAddress } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    const normalizedAddress = walletAddress.toLowerCase();
    
    // Find existing connection or create new one
    let connection = await UserConnection.findOne({ walletAddress: normalizedAddress });
    
    if (connection) {
      // Update existing connection
      connection.lastConnected = new Date(timestamp || Date.now());
      connection.connectionCount += 1;
      connection.sessionData.push({
        timestamp: new Date(timestamp || Date.now()),
        userAgent,
        ipAddress
      });
    } else {
      // Create new connection
      connection = new UserConnection({
        walletAddress: normalizedAddress,
        firstConnected: new Date(timestamp || Date.now()),
        lastConnected: new Date(timestamp || Date.now()),
        connectionCount: 1,
        userAgent,
        ipAddress,
        sessionData: [{
          timestamp: new Date(timestamp || Date.now()),
          userAgent,
          ipAddress
        }]
      });
    }
    
    await connection.save();
    
    res.status(200).json({ 
      message: 'Connection tracked successfully',
      connectionCount: connection.connectionCount 
    });
  } catch (error) {
    console.error('Error tracking wallet connection:', error);
    res.status(500).json({ error: 'Failed to track connection' });
  }
});

// Track policy purchase
router.post('/policy-purchase', async (req, res) => {
  try {
    const {
      walletAddress,
      policyType,
      premium,
      coverage,
      duration,
      totalPaid,
      platformFee,
      txHash,
      purchaseTimestamp,
      coverageAmount,
      riskScore
    } = req.body;

    if (!walletAddress || !policyType || !premium || !txHash) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const purchase = new PolicyPurchase({
      walletAddress: walletAddress.toLowerCase(),
      policyType,
      premium,
      coverage,
      duration,
      totalPaid,
      platformFee,
      txHash,
      purchaseTimestamp: new Date(purchaseTimestamp || Date.now()),
      coverageAmount,
      riskScore
    });

    await purchase.save();
    
    res.status(201).json({ 
      message: 'Policy purchase tracked successfully',
      policyId: purchase._id 
    });
  } catch (error) {
    console.error('Error tracking policy purchase:', error);
    if (error.code === 11000) {
      res.status(400).json({ error: 'Transaction hash already exists' });
    } else {
      res.status(500).json({ error: 'Failed to track policy purchase' });
    }
  }
});

// Track policy claim
router.post('/policy-claim', async (req, res) => {
  try {
    const { walletAddress, policyId, claimAmount, txHash, claimTimestamp, reason } = req.body;

    if (!walletAddress || !policyId || !claimAmount || !txHash) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const claim = new PolicyClaim({
      walletAddress: walletAddress.toLowerCase(),
      policyId,
      claimAmount,
      txHash,
      claimTimestamp: new Date(claimTimestamp || Date.now()),
      reason
    });

    await claim.save();

    // Update policy status to claimed
    await PolicyPurchase.findByIdAndUpdate(policyId, { status: 'claimed' });
    
    res.status(201).json({ 
      message: 'Policy claim tracked successfully',
      claimId: claim._id 
    });
  } catch (error) {
    console.error('Error tracking policy claim:', error);
    res.status(500).json({ error: 'Failed to track policy claim' });
  }
});

// Get user analytics
router.get('/user/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const normalizedAddress = walletAddress.toLowerCase();

    // Get user connection data
    const connection = await UserConnection.findOne({ walletAddress: normalizedAddress });
    
    // Get user purchases
    const purchases = await PolicyPurchase.find({ walletAddress: normalizedAddress });
    
    // Get user claims
    const claims = await PolicyClaim.find({ walletAddress: normalizedAddress });

    // Calculate analytics
    const totalPoliciesPurchased = purchases.length;
    const totalAmountSpent = purchases.reduce((sum, p) => sum + p.totalPaid, 0);
    const totalCoverageAmount = purchases.reduce((sum, p) => sum + (p.coverageAmount || 0), 0);
    const activePolicies = purchases.filter(p => p.status === 'active').length;
    const claimedPolicies = purchases.filter(p => p.status === 'claimed').length;
    const averagePolicyValue = totalPoliciesPurchased > 0 ? totalAmountSpent / totalPoliciesPurchased : 0;

    // Find favorite policy type
    const policyTypeCounts = purchases.reduce((acc, p) => {
      acc[p.policyType] = (acc[p.policyType] || 0) + 1;
      return acc;
    }, {});
    const favoritePolicyType = Object.keys(policyTypeCounts).reduce((a, b) => 
      policyTypeCounts[a] > policyTypeCounts[b] ? a : b, 'none');

    // Calculate risk score (average of all policies)
    const riskScore = purchases.length > 0 ? 
      purchases.reduce((sum, p) => sum + (p.riskScore || 50), 0) / purchases.length : 50;

    const analytics = {
      walletAddress: normalizedAddress,
      totalPoliciesPurchased,
      totalAmountSpent,
      totalCoverageAmount,
      activePolicies,
      claimedPolicies,
      averagePolicyValue,
      firstPurchaseDate: purchases.length > 0 ? purchases[0].purchaseTimestamp : null,
      lastPurchaseDate: purchases.length > 0 ? purchases[purchases.length - 1].purchaseTimestamp : null,
      favoritePolicyType,
      riskScore,
      connectionData: connection ? {
        firstConnected: connection.firstConnected,
        lastConnected: connection.lastConnected,
        connectionCount: connection.connectionCount
      } : null,
      claimsData: {
        totalClaims: claims.length,
        totalClaimAmount: claims.reduce((sum, c) => sum + c.claimAmount, 0),
        pendingClaims: claims.filter(c => c.status === 'pending').length,
        approvedClaims: claims.filter(c => c.status === 'approved').length
      }
    };

    res.json(analytics);
  } catch (error) {
    console.error('Error getting user analytics:', error);
    res.status(500).json({ error: 'Failed to get user analytics' });
  }
});

// Get global analytics
router.get('/global', async (req, res) => {
  try {
    // Get total users
    const totalUsers = await UserConnection.countDocuments();
    
    // Get total connections
    const totalConnections = await UserConnection.aggregate([
      { $group: { _id: null, total: { $sum: '$connectionCount' } } }
    ]);

    // Get policy statistics
    const totalPoliciesSold = await PolicyPurchase.countDocuments();
    const activePoliciesCount = await PolicyPurchase.countDocuments({ status: 'active' });
    const claimedPoliciesCount = await PolicyPurchase.countDocuments({ status: 'claimed' });
    
    // Get revenue data
    const revenueData = await PolicyPurchase.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$totalPaid' }, totalCoverage: { $sum: '$coverageAmount' } } }
    ]);

    // Get average policy value
    const avgPolicyData = await PolicyPurchase.aggregate([
      { $group: { _id: null, average: { $avg: '$totalPaid' } } }
    ]);

    // Get top policy types
    const topPolicyTypes = await PolicyPurchase.aggregate([
      {
        $group: {
          _id: '$policyType',
          count: { $sum: 1 },
          revenue: { $sum: '$totalPaid' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          type: '$_id',
          count: 1,
          revenue: 1,
          _id: 0
        }
      }
    ]);

    // Get user growth data (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const userGrowthData = await UserConnection.aggregate([
      { $match: { firstConnected: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$firstConnected' } },
          newUsers: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: '$_id',
          newUsers: 1,
          _id: 0
        }
      }
    ]);

    // Get revenue data (last 30 days)
    const revenueGrowthData = await PolicyPurchase.aggregate([
      { $match: { purchaseTimestamp: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$purchaseTimestamp' } },
          revenue: { $sum: '$totalPaid' },
          policies: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: '$_id',
          revenue: 1,
          policies: 1,
          _id: 0
        }
      }
    ]);

    const analytics = {
      totalUsers,
      totalConnections: totalConnections[0]?.total || 0,
      totalPoliciesSold,
      totalRevenue: revenueData[0]?.totalRevenue || 0,
      totalCoverageIssued: revenueData[0]?.totalCoverage || 0,
      activePoliciesCount,
      claimedPoliciesCount,
      averagePolicyValue: avgPolicyData[0]?.average || 0,
      topPolicyTypes,
      userGrowthData,
      revenueData: revenueGrowthData
    };

    res.json(analytics);
  } catch (error) {
    console.error('Error getting global analytics:', error);
    res.status(500).json({ error: 'Failed to get global analytics' });
  }
});

// Get all connected users (admin endpoint)
router.get('/all-users', async (req, res) => {
  try {
    const { page = 1, limit = 50, sort = 'lastConnected' } = req.query;
    
    const users = await UserConnection.find()
      .sort({ [sort]: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await UserConnection.countDocuments();

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error getting all users:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Get user connections history
router.get('/connections/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const connection = await UserConnection.findOne({ 
      walletAddress: walletAddress.toLowerCase() 
    });

    if (!connection) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(connection);
  } catch (error) {
    console.error('Error getting user connections:', error);
    res.status(500).json({ error: 'Failed to get user connections' });
  }
});

// Get user purchases history
router.get('/purchases/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const purchases = await PolicyPurchase.find({ 
      walletAddress: walletAddress.toLowerCase() 
    })
      .sort({ purchaseTimestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await PolicyPurchase.countDocuments({ 
      walletAddress: walletAddress.toLowerCase() 
    });

    res.json({
      purchases,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error getting user purchases:', error);
    res.status(500).json({ error: 'Failed to get user purchases' });
  }
});

// Get revenue analytics
router.get('/revenue', async (req, res) => {
  try {
    const { timeframe = 'month' } = req.query;
    
    let dateRange = new Date();
    switch (timeframe) {
      case 'day':
        dateRange.setDate(dateRange.getDate() - 1);
        break;
      case 'week':
        dateRange.setDate(dateRange.getDate() - 7);
        break;
      case 'month':
        dateRange.setMonth(dateRange.getMonth() - 1);
        break;
      case 'year':
        dateRange.setFullYear(dateRange.getFullYear() - 1);
        break;
    }

    const revenueData = await PolicyPurchase.aggregate([
      { $match: { purchaseTimestamp: { $gte: dateRange } } },
      {
        $group: {
          _id: {
            $dateToString: { 
              format: timeframe === 'day' ? '%Y-%m-%d %H:00' : '%Y-%m-%d', 
              date: '$purchaseTimestamp' 
            }
          },
          revenue: { $sum: '$totalPaid' },
          policies: { $sum: 1 },
          averageValue: { $avg: '$totalPaid' }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: '$_id',
          revenue: 1,
          policies: 1,
          averageValue: 1,
          _id: 0
        }
      }
    ]);

    res.json(revenueData);
  } catch (error) {
    console.error('Error getting revenue analytics:', error);
    res.status(500).json({ error: 'Failed to get revenue analytics' });
  }
});

// Get policy type analytics
router.get('/policy-types', async (req, res) => {
  try {
    const policyTypeData = await PolicyPurchase.aggregate([
      {
        $group: {
          _id: '$policyType',
          count: { $sum: 1 },
          revenue: { $sum: '$totalPaid' },
          averageValue: { $avg: '$totalPaid' },
          totalCoverage: { $sum: '$coverageAmount' }
        }
      },
      { $sort: { revenue: -1 } },
      {
        $project: {
          type: '$_id',
          count: 1,
          revenue: 1,
          averageValue: 1,
          totalCoverage: 1,
          _id: 0
        }
      }
    ]);

    res.json(policyTypeData);
  } catch (error) {
    console.error('Error getting policy type analytics:', error);
    res.status(500).json({ error: 'Failed to get policy type analytics' });
  }
});

// Get user growth analytics
router.get('/user-growth', async (req, res) => {
  try {
    const { timeframe = 'day' } = req.query;
    
    let days = 30;
    switch (timeframe) {
      case 'day':
        days = 30;
        break;
      case 'week':
        days = 84; // 12 weeks
        break;
      case 'month':
        days = 365; // 12 months
        break;
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const userGrowthData = await UserConnection.aggregate([
      { $match: { firstConnected: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { 
              format: timeframe === 'month' ? '%Y-%m' : '%Y-%m-%d', 
              date: '$firstConnected' 
            }
          },
          newUsers: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: '$_id',
          newUsers: 1,
          _id: 0
        }
      }
    ]);

    // Calculate cumulative totals
    let cumulativeTotal = 0;
    const enrichedData = userGrowthData.map(item => {
      cumulativeTotal += item.newUsers;
      return {
        ...item,
        totalUsers: cumulativeTotal
      };
    });

    res.json(enrichedData);
  } catch (error) {
    console.error('Error getting user growth analytics:', error);
    res.status(500).json({ error: 'Failed to get user growth analytics' });
  }
});

export default router;
