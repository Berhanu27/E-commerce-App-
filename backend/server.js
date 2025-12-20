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

// CORS configuration - Allow all origins for now to fix deployment issues
const allowedOrigins = [
  // Production URLs
  'https://e-commerce-app-lfz6.vercel.app',
  'https://e-commerce-app-tgr8.vercel.app',
  'https://e-commerce-app-seven-mocha.vercel.app',
  // Environment variable URLs
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  // Local development
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow all vercel.app subdomains
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    
    // Block other origins
    console.log('CORS blocked origin:', origin);
    return callback(null, true); // Allow all for now to debug
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token'],
  optionsSuccessStatus: 200
};

// Handle preflight requests
app.options('*', cors(corsOptions));
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