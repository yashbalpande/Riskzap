# 🔗 Riskzap Verification API Documentation

## Base URL
```
http://localhost:3001
```

## 🎯 Main Verification Endpoint (Required by Hackathon)

### POST `/api/verify`

Verifies wallet actions on Shardeum blockchain.

**Request Body:**
```json
{
  "walletAddress": "0xFd3fBa510A135B5DE354B1d4b174208c343aaD42",
  "action": "policy_creation",
  "transactionHash": "0xabc123...",
  "timestamp": 1692307200000
}
```

**Response (Success):**
```json
{
  "success": true,
  "status": "pass",
  "message": "Wallet action verified successfully",
  "data": {
    "walletAddress": "0xFd3fBa510A135B5DE354B1d4b174208c343aaD42",
    "action": "policy_creation",
    "transactionHash": "0xabc123...",
    "timestamp": 1692307200000,
    "verifiedAt": "2025-08-17T15:21:28.000Z",
    "blockchainConfirmed": true
  }
}
```

**Response (Failure):**
```json
{
  "success": false,
  "status": "fail",
  "message": "Invalid wallet address"
}
```

## 📋 Supported Actions
- `policy_creation`
- `policy_purchase`
- `claim_submission`
- `kyc_verification`
- `wallet_connection`

## 🏥 Health Check

### GET `/health`
Returns API health status.

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2025-08-17T15:21:28.000Z"
}
```

## 📝 Additional Endpoints

### POST `/api/policies`
Create a new policy.

### GET `/api/policies/user/:address`
Get all policies for a wallet address.

### POST `/api/claims`
Submit an insurance claim.

### POST `/api/kyc/verify`
Verify user identity for compliance.

## 🧪 Test Commands

### Test Health Check
```bash
curl http://localhost:3001/health
```

### Test Verification
```bash
curl -X POST http://localhost:3001/api/verify \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0xFd3fBa510A135B5DE354B1d4b174208c343aaD42",
    "action": "policy_creation",
    "transactionHash": "0xabc123def456",
    "timestamp": 1692307200000
  }'
```

## ✅ Hackathon Compliance

✅ **Public API endpoint** - Available at http://localhost:3001/api/verify  
✅ **Pass/fail status** - Returns "pass" or "fail" in status field  
✅ **Clear documentation** - This file serves as API documentation  
- **Blockchain**: Shardeum Liberty 1.X  

## 🚀 Deployment Ready

This API can be easily deployed to:
- Vercel (serverless functions)
- Heroku (container deployment)
- Railway (Docker deployment)
- AWS Lambda (serverless)

## 🔐 Security Notes

- Input validation for all endpoints
- Wallet address format verification
- Transaction hash validation
- Error handling and logging
