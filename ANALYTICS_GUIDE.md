# 🚀 Zenith Policy Guard - Quick Start Guide

## Getting Started

### 1. Start Both Servers

Run the main startup script to launch both frontend and analytics API:

```bash
# Using the batch file (Windows)
start-all.bat

# Or manually:
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Analytics API
cd analytics-api
node server.js
```

**Access URLs:**
- **Frontend**: http://localhost:8082
- **Analytics API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

### 2. Accessing Analytics Dashboard

1. Open the frontend at http://localhost:8082
2. Click on "ANALYTICS" in the top navigation
3. The analytics dashboard will show:
   - **Analytics Tab**: Real-time user and revenue data
   - **Contracts Tab**: Smart contract configuration  
   - **System Tab**: Environment and API settings

### 3. How Analytics Data is Collected

Analytics are automatically tracked when users:

#### Wallet Connections
- **Tracked**: Every time a user connects their MetaMask wallet
- **Data**: Wallet address, timestamp, user agent, session data
- **Location**: Integrated in `connectWallet()` function

#### Policy Purchases  
- **Tracked**: When users buy insurance policies
- **Data**: Policy type, premium, coverage, duration, transaction hash
- **Location**: Added to `PolicyCards.tsx` purchase flow

#### Policy Claims
- **Tracked**: When users file insurance claims  
- **Data**: Claim amount, policy ID, wallet address, claim timestamp
- **Location**: Added to `MyPolicies.tsx` claim flow

### 4. Viewing Data in MongoDB

To see your analytics data in MongoDB Atlas:

#### Method 1: MongoDB Atlas Dashboard
1. Visit https://cloud.mongodb.com/
2. Log in with credentials: `yashbalpande25_db_user`
3. Navigate to your cluster: `Cluster0`
4. Click "Browse Collections"
5. Select database: `zenith-analytics`
6. View collections:
   - `userConnections` - Wallet connection data
   - `policyPurchases` - Policy purchase records
   - `policyClaims` - Insurance claim data

#### Method 2: Using API Endpoints

Test the analytics API directly:

```bash
# Get global analytics
curl http://localhost:3001/api/analytics/global

# Get user analytics (replace with actual wallet address)
curl http://localhost:3001/api/analytics/user/0x1234...

# Get all connected users
curl http://localhost:3001/api/analytics/all-users

# Get revenue data
curl http://localhost:3001/api/analytics/revenue?timeframe=month
```

#### Method 3: Analytics Dashboard

The built-in dashboard shows:
- Total users and connections
- Revenue metrics and trends  
- Policy type distribution
- User growth over time
- Real-time platform statistics

### 5. Testing Analytics Flow

To generate test data:

1. **Connect Wallet**: 
   - Click "Connect Wallet" in the app
   - Approve MetaMask connection
   - ✅ Creates `userConnections` record

2. **Purchase Policy**:
   - Go to "POLICIES" section
   - Click "Quick Buy" on any policy
   - Complete MetaMask transaction
   - ✅ Creates `policyPurchases` record

3. **File Claim**:
   - Go to "MY ACCOUNT" section  
   - Click "File Claim" on an active policy
   - Confirm the claim
   - ✅ Creates `policyClaims` record

4. **View Analytics**:
   - Go to "ANALYTICS" section
   - View real-time data updates
   - Check user growth and revenue charts

### 6. Environment Configuration

Your analytics API is configured with:

```env
PORT=3001
MONGODB_URI=mongodb+srv://yashbalpande25_db_user:***@cluster0.aa0bqrb.mongodb.net/zenith-analytics
CORS_ORIGIN=http://localhost:8082,http://localhost:3000
```

### 7. Production Deployment

For production:

1. **Analytics API**:
   ```bash
   cd analytics-api
   npm run build
   npm start
   ```

2. **Frontend**:
   ```bash
   npm run build
   npm run preview
   ```

3. **Environment Variables**:
   - Update `MONGODB_URI` with production credentials
   - Set `CORS_ORIGIN` to your production domain
   - Configure `JWT_SECRET` and `API_KEY`

## 📊 Data Structure

### User Connections
```json
{
  "walletAddress": "0x...",
  "firstConnected": "2025-09-06T10:00:00Z",
  "lastConnected": "2025-09-06T15:30:00Z", 
  "connectionCount": 5,
  "sessionData": [...]
}
```

### Policy Purchases
```json
{
  "walletAddress": "0x...",
  "policyType": "health",
  "premium": 150.00,
  "coverage": "$10,000",
  "duration": "365 days",
  "totalPaid": 150.00,
  "txHash": "0x...",
  "status": "active"
}
```

### Policy Claims  
```json
{
  "walletAddress": "0x...",
  "policyId": "policy_id_123",
  "claimAmount": 125.50,
  "txHash": "local_claim_123456",
  "status": "approved"
}
```

## 🔧 Troubleshooting

### Analytics API Won't Start
- Check if port 3001 is available
- Verify MongoDB connection string
- Check `.env` file exists in `analytics-api/`

### No Data in Dashboard  
- Ensure analytics API is running on port 3001
- Check browser console for CORS errors
- Test API endpoints directly with curl

### MongoDB Connection Issues
- Verify internet connection
- Check MongoDB Atlas cluster status
- Confirm IP address is whitelisted

---

🎉 **You're all set!** Your analytics system is now tracking user behavior, policy purchases, and claims in real-time.
