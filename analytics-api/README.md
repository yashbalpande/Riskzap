# Zenith Policy Guard - Analytics API

A comprehensive analytics API for tracking user behavior, policy purchases, wallet connections, and system metrics for the Zenith Policy Guard insurance platform.

## 🚀 Features

- **User Analytics**: Track wallet connections, session data, and user behavior
- **Policy Analytics**: Monitor policy purchases, claims, and revenue metrics
- **Global Analytics**: System-wide statistics and performance metrics
- **Real-time Tracking**: Live analytics with automatic data aggregation
- **MongoDB Integration**: Robust data storage with indexing for performance
- **RESTful API**: Clean, well-documented endpoints for easy integration

## 📊 Tracked Metrics

### User Metrics
- Wallet connection events and frequency
- User session data and timestamps
- First-time vs returning users
- Geographic data (IP-based)

### Policy Metrics
- Policy purchases by type and amount
- Premium calculations and fees
- Coverage amounts and durations
- Policy status (active, claimed, expired)
- Claims processing and payouts

### Financial Metrics
- Total revenue and transaction volumes
- Average policy values
- Platform fees collected
- Revenue trends over time

### System Metrics
- Total users and connections
- Policy distribution by type
- User growth patterns
- Platform health indicators

## 🛠 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- npm or yarn

### Setup

1. **Clone and install dependencies:**
```bash
cd analytics-api
npm install
```

2. **Configure environment variables:**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb+srv://yashbalpande25_db_user:5PDnaVKFmn3D4uBh@cluster0.aa0bqrb.mongodb.net/zenith-analytics?retryWrites=true&w=majority&appName=Cluster0
CORS_ORIGIN=http://localhost:8082,https://zenith-policy-guard.vercel.app
```

3. **Start the server:**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:3001`

## 📡 API Endpoints

### User Analytics

#### Track Wallet Connection
```http
POST /api/analytics/wallet-connection
Content-Type: application/json

{
  "walletAddress": "0x...",
  "timestamp": "2025-09-06T10:30:00Z",
  "userAgent": "Mozilla/5.0...",
  "ipAddress": "192.168.1.1"
}
```

#### Track Policy Purchase
```http
POST /api/analytics/policy-purchase
Content-Type: application/json

{
  "walletAddress": "0x...",
  "policyType": "health",
  "premium": 150.00,
  "coverage": "$10,000",
  "duration": "365 days",
  "totalPaid": 150.00,
  "platformFee": 15.00,
  "txHash": "0x...",
  "coverageAmount": 10000
}
```

#### Get User Analytics
```http
GET /api/analytics/user/:walletAddress
```

**Response:**
```json
{
  "walletAddress": "0x...",
  "totalPoliciesPurchased": 5,
  "totalAmountSpent": 750.00,
  "totalCoverageAmount": 50000,
  "activePolicies": 3,
  "claimedPolicies": 2,
  "averagePolicyValue": 150.00,
  "firstPurchaseDate": "2025-01-15T10:00:00Z",
  "lastPurchaseDate": "2025-09-01T14:30:00Z",
  "favoritePolicyType": "health",
  "riskScore": 65.5,
  "connectionData": {
    "firstConnected": "2025-01-10T09:00:00Z",
    "lastConnected": "2025-09-06T10:30:00Z",
    "connectionCount": 45
  }
}
```

### Global Analytics

#### Get System Overview
```http
GET /api/analytics/global
```

**Response:**
```json
{
  "totalUsers": 1250,
  "totalConnections": 15680,
  "totalPoliciesSold": 3420,
  "totalRevenue": 485000.00,
  "totalCoverageIssued": 34200000,
  "activePoliciesCount": 2890,
  "claimedPoliciesCount": 530,
  "averagePolicyValue": 141.81,
  "topPolicyTypes": [
    {
      "type": "health",
      "count": 1200,
      "revenue": 180000.00
    }
  ],
  "userGrowthData": [...],
  "revenueData": [...]
}
```

#### Get Revenue Analytics
```http
GET /api/analytics/revenue?timeframe=month
```

**Query Parameters:**
- `timeframe`: `day`, `week`, `month`, `year`

#### Get Policy Type Distribution
```http
GET /api/analytics/policy-types
```

#### Get User Growth Data
```http
GET /api/analytics/user-growth?timeframe=day
```

### Administrative Endpoints

#### Get All Connected Users
```http
GET /api/analytics/all-users?page=1&limit=50&sort=lastConnected
```

#### Get User Purchase History
```http
GET /api/analytics/purchases/:walletAddress?page=1&limit=20
```

## 📊 Frontend Integration

### Analytics Service Usage

```typescript
import { analyticsService } from '../services/analytics';

// Track wallet connection
await analyticsService.trackWalletConnection(
  walletAddress, 
  navigator.userAgent
);

// Track policy purchase
await analyticsService.trackPolicyPurchase({
  walletAddress,
  policyType: 'health',
  premium: 150,
  coverage: '$10,000',
  duration: '365 days',
  totalPaid: 150,
  platformFee: 15,
  txHash: transactionHash,
  status: 'active',
  coverageAmount: 10000
});

// Get user analytics
const userStats = await analyticsService.getUserAnalytics(walletAddress);

// Get global analytics
const globalStats = await analyticsService.getGlobalAnalytics();
```

### Dashboard Component

The `AnalyticsDashboard` component provides a comprehensive view of all metrics:

```tsx
import { AnalyticsDashboard } from './components/AnalyticsDashboard';

function AdminPanel() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <AnalyticsDashboard />
    </div>
  );
}
```

## 🔐 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configurable origin restrictions
- **Input Validation**: Request data validation and sanitization
- **Error Handling**: Comprehensive error responses
- **MongoDB Security**: Connection string encryption and access controls

## 📈 Database Schema

### Collections

#### `userConnections`
- `walletAddress`: String (indexed, lowercase)
- `firstConnected`: Date
- `lastConnected`: Date  
- `connectionCount`: Number
- `sessionData`: Array of session objects

#### `policyPurchases`
- `walletAddress`: String (indexed)
- `policyType`: Enum ['health', 'auto', 'travel', 'life', 'property', 'crypto']
- `premium`: Number
- `coverage`: String
- `duration`: Enum ['5 days', '30 days', '120 days', '365 days', '365+ days']
- `totalPaid`: Number
- `platformFee`: Number
- `txHash`: String (unique)
- `status`: Enum ['active', 'claimed', 'expired']

#### `policyClaims`
- `walletAddress`: String (indexed)
- `policyId`: ObjectId (ref to PolicyPurchase)
- `claimAmount`: Number
- `txHash`: String (unique)
- `status`: Enum ['pending', 'approved', 'rejected', 'paid']

## 🚀 Deployment

### Environment Setup

1. **MongoDB Atlas**: Create cluster and get connection string
2. **Environment Variables**: Configure all required env vars
3. **CORS Origins**: Set production domain origins
4. **API Keys**: Generate secure API keys for authentication

### Production Deployment

```bash
# Install dependencies
npm ci --production

# Build application
npm run build

# Start with PM2
pm2 start server.js --name "zenith-analytics-api"

# Or use Docker
docker build -t zenith-analytics-api .
docker run -p 3001:3001 zenith-analytics-api
```

## 📝 API Response Format

All API responses follow a consistent format:

**Success Response:**
```json
{
  "data": { ... },
  "message": "Success",
  "timestamp": "2025-09-06T10:30:00Z"
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2025-09-06T10:30:00Z",
  "path": "/api/analytics/endpoint"
}
```

## 🔧 Configuration Options

### Rate Limiting
```env
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100  # Max requests per window
```

### CORS Settings
```env
CORS_ORIGIN=http://localhost:8082,https://yourdomain.com
```

### Database Options
```env
MONGODB_URI=mongodb+srv://...
# Database automatically creates indexes for optimal performance
```

## 📊 Monitoring & Health Checks

### Health Check Endpoint
```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-09-06T10:30:00Z",
  "mongodb": "connected"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **GitHub Issues**: [Create an issue](https://github.com/yashbalpande/zenith-policy-guard/issues)
- **Documentation**: Full API documentation available at `/docs`
- **Discord**: Join our development community

---

**Built with ❤️ by the Zenith Policy Guard Team**

For more information, visit: [GitHub Repository](https://github.com/yashbalpande/zenith-policy-guard)
