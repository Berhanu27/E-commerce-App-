# Vercel Deployment Guide

This project consists of three parts that need to be deployed separately:
1. **Backend API** (Node.js/Express)
2. **Frontend** (React/Vite)
3. **Admin Panel** (React/Vite)

## Prerequisites

1. Install Vercel CLI: `npm install -g vercel`
2. Create a Vercel account at https://vercel.com
3. Login to Vercel: `vercel login`

## Deployment Steps

### 1. Deploy Backend First

```bash
cd backend
vercel
```

**During deployment, configure these environment variables in Vercel dashboard:**

```
NODE_ENV=production
PORT=4000
MONGO_URL=mongodb+srv://brexman:br21348555ml@cluster0.euvmcc3.mongodb.net/ecommerce
CLOUD_NAME=dw7lvej3e
CLOUD_API_KEY=763123951558174
CLOUD_API_SECRET=D0zyLHaI5YT4VERHJvDJw7gNTc0
JWT_SECRET=brexman12345
ADMIN_EMAIL=berhanumulu2024@gmail.com
ADMIN_PASSWORD=br21348555ml
CHAPA_SECRET_KEY=CHASECK_TEST-CT9xBuocClVtf9tIJwcy2KeaqRwFyLSx
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
MPESA_ENVIRONMENT=sandbox
MPESA_BUSINESS_SHORT_CODE=174379
MPESA_PASSKEY=your_mpesa_passkey
```

**Note:** After backend deployment, copy the backend URL (e.g., `https://your-backend.vercel.app`)

### 2. Update Frontend Environment

Update `frontend/.env.production`:
```
VITE_BACKEND_URL=https://your-actual-backend-url.vercel.app
```

### 3. Deploy Frontend

```bash
cd frontend
vercel
```

### 4. Update Admin Environment

Update `admin/.env.production`:
```
VITE_BACKEND_URL=https://your-actual-backend-url.vercel.app
```

### 5. Deploy Admin Panel

```bash
cd admin
vercel
```

## Post-Deployment Configuration

### Update CORS Settings
After deployment, update the backend CORS configuration to allow your frontend and admin domains.

### Update Callback URLs
Update payment callback URLs in your environment variables:
- Chapa callback URLs
- M-Pesa callback URLs

### Test All Features
1. Test user registration/login
2. Test product management (admin)
3. Test order placement
4. Test payment methods (Chapa, M-Pesa, COD)

## Deployment URLs Structure

After successful deployment, you'll have:
- **Backend API**: `https://your-backend.vercel.app`
- **Frontend**: `https://your-frontend.vercel.app`
- **Admin Panel**: `https://your-admin.vercel.app`

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Update backend CORS settings to include your frontend domains
2. **Environment Variables**: Ensure all required env vars are set in Vercel dashboard
3. **Database Connection**: Verify MongoDB connection string is correct
4. **Payment Callbacks**: Update callback URLs to use production domains

### Vercel CLI Commands:
- `vercel --prod` - Deploy to production
- `vercel env` - Manage environment variables
- `vercel logs` - View deployment logs
- `vercel domains` - Manage custom domains

## Custom Domains (Optional)

To use custom domains:
1. Go to Vercel dashboard
2. Select your project
3. Go to Settings > Domains
4. Add your custom domain
5. Update DNS records as instructed

## Security Notes

- Never commit `.env` files with production secrets
- Use Vercel's environment variables for sensitive data
- Enable HTTPS for all production deployments
- Regularly rotate API keys and secrets