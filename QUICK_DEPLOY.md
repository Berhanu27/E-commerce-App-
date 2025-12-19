# Quick Deployment Guide 🚀

## Prerequisites
1. Install Vercel CLI: `npm install -g vercel`
2. Login to Vercel: `vercel login`

## Manual Deployment Steps

### 1️⃣ Deploy Backend
```bash
cd backend
vercel
```
- Follow prompts to create new project
- Copy the deployment URL (e.g., `https://backend-abc123.vercel.app`)

### 2️⃣ Add Environment Variables
Go to Vercel Dashboard → Your Backend Project → Settings → Environment Variables

Add these variables:
```
NODE_ENV=production
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
MPESA_CALLBACK_URL=https://your-backend-url.vercel.app/api/order/mpesa/callback
```

### 3️⃣ Update Frontend Environment
```bash
# Update frontend/.env.production with your backend URL
echo "VITE_BACKEND_URL=https://your-backend-url.vercel.app" > frontend/.env.production
```

### 4️⃣ Deploy Frontend
```bash
cd frontend
vercel
```

### 5️⃣ Update Admin Environment
```bash
# Update admin/.env.production with your backend URL
echo "VITE_BACKEND_URL=https://your-backend-url.vercel.app" > admin/.env.production
```

### 6️⃣ Deploy Admin
```bash
cd admin
vercel
```

### 7️⃣ Update CORS (Important!)
Update `backend/server.js` CORS configuration with your actual URLs:
```javascript
origin: [
  'https://your-frontend-url.vercel.app',
  'https://your-admin-url.vercel.app'
]
```

Then redeploy backend:
```bash
cd backend
vercel --prod
```

## ✅ Verification Checklist
- [ ] Backend API responds at `/api/product/list`
- [ ] Frontend loads and shows products
- [ ] Admin panel loads and allows login
- [ ] User registration/login works
- [ ] Order placement works
- [ ] Payment methods function correctly

## 🔧 Troubleshooting
- **CORS errors**: Update backend CORS settings
- **API not found**: Check environment variables
- **Database errors**: Verify MongoDB connection
- **Payment issues**: Update callback URLs

## 📱 Test URLs
After deployment, test these endpoints:
- `GET https://your-backend.vercel.app/api/product/list`
- `GET https://your-backend.vercel.app/api/order/chapa/test`
- `GET https://your-backend.vercel.app/api/order/mpesa/test`