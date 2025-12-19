# M-Pesa Integration Setup

## Overview
This project includes M-Pesa payment integration for mobile money payments in Kenya and Ethiopia.

## Current Status
- ✅ Basic M-Pesa integration structure implemented
- ✅ Mock implementation for development/testing
- ⚠️ Real M-Pesa SDK needs to be configured with actual credentials

## Setup Instructions

### 1. Get M-Pesa Credentials
1. Register with Safaricom M-Pesa (Kenya) or Ethio Telecom M-Pesa (Ethiopia)
2. Get your Consumer Key and Consumer Secret
3. Get your Business Short Code and Passkey

### 2. Update Environment Variables
Update your `.env` file with real M-Pesa credentials:

```env
# M-Pesa Payment
MPESA_CONSUMER_KEY="your_actual_consumer_key"
MPESA_CONSUMER_SECRET="your_actual_consumer_secret"
MPESA_ENVIRONMENT="sandbox"  # or "production"
MPESA_BUSINESS_SHORT_CODE="your_business_shortcode"
MPESA_PASSKEY="your_passkey"
MPESA_CALLBACK_URL="https://yourdomain.com/api/order/mpesa/callback"
```

### 3. Replace Mock Implementation
In `backend/config/mpesaClient.js`, replace the SimpleMpesa class with the real SDK:

```javascript
import { Mpesa } from '@safaricom-et/mpesa-node-js-sdk';

export const mpesa = new Mpesa({
  apiKey: process.env.MPESA_CONSUMER_KEY,
  secretKey: process.env.MPESA_CONSUMER_SECRET,
  environment: process.env.MPESA_ENVIRONMENT || 'sandbox',
});
```

## API Endpoints

### Place M-Pesa Order
- **POST** `/api/order/mpesa`
- **Headers**: `token: <jwt_token>`
- **Body**:
```json
{
  "items": [...],
  "amount": 1000,
  "address": {...},
  "phoneNumber": "254700123456"
}
```

### M-Pesa Callback
- **POST** `/api/order/mpesa/callback`
- Handles payment confirmation from M-Pesa

### Check Payment Status
- **GET** `/api/order/mpesa/status/:checkoutRequestId`
- **Headers**: `token: <jwt_token>`

## Testing
- Use the test endpoint: `GET /api/order/mpesa/test`
- Currently returns mock responses for development

## Phone Number Format
Accepts these formats:
- `254700123456` (full international format)
- `0700123456` (local format - converted to international)
- `700123456` (without leading zero - converted to international)

## Production Deployment
1. Set `MPESA_ENVIRONMENT=production`
2. Use production credentials
3. Ensure callback URL is publicly accessible
4. Test thoroughly in sandbox first