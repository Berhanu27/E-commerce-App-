import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './route/userRoute.js';
import productRouter from './route/productRoute.js';
import mongoose from 'mongoose';
import cartRouter from './route/cartRoute.js';
import orderRouter from './route/orderRoute.js'; // ✅ Fixed typo: "ordrRouter" → "orderRouter"

const app = express();
const port = process.env.PORT || 4000;

// Connect DB with better error handling for serverless
connectDB().then(() => {
  console.log('DB Connected Successfully');

  // Optional: clear cached models if needed
  delete mongoose.connection.models["product"];
  delete mongoose.connection.models["Product"];
  delete mongoose.models["product"];
  delete mongoose.models["Product"];
}).catch((error) => {
  console.error('DB Connection Failed:', error);
  // Don't exit process in serverless environment
});

connectCloudinary();

// Middlewares
app.use(express.json());

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        process.env.FRONTEND_URL || 'https://e-commerce-app-frontend.vercel.app',
        process.env.ADMIN_URL || 'https://e-commerce-app-admin.vercel.app',
        // Add the actual frontend URL from the error
        'https://e-commerce-app-8ajd-8m66nrg5d-birhanu-mulus-projects.vercel.app',
        // Fallback patterns for your deployment
        'https://e-commerce-app-*.vercel.app',
        // Allow all subdomains for Vercel preview deployments
        /https:\/\/.*\.vercel\.app$/,
      ]
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token']
};

app.use(cors(corsOptions));

// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter); // ✅ Now matches import

app.get('/', (req, res) => {
  res.send('API WORKING');
});

// Debug endpoint to check CORS and environment
app.get('/debug', (req, res) => {
  res.json({
    message: 'Debug endpoint',
    origin: req.headers.origin,
    nodeEnv: process.env.NODE_ENV,
    corsOrigins: corsOptions.origin,
    timestamp: new Date().toISOString()
  });
});

// For Vercel serverless deployment
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log('Server started on PORT:', port);
  });
}