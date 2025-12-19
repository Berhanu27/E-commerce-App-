import express from 'express';
import {
  placeOrder,
  placeOrderChapa,
  placeOrderMpesa,
  allOrder,
  userOrders,
  updateStatus,
  verifyPayment,
  mpesaCallback,
  checkMpesaStatus,
} from '../controller/orderController.js';

import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const orderRouter = express.Router();

// ========================
// Admin Routes
// ========================
orderRouter.get('/list', adminAuth, allOrder); // Get all orders
orderRouter.post('/status', adminAuth, updateStatus); // Update order status

// ========================
// User Payment Routes
// ========================
orderRouter.post('/place', authUser, placeOrder); // Cash on delivery
orderRouter.post('/chapa', authUser, placeOrderChapa); // Chapa payment
orderRouter.post('/mpesa', authUser, placeOrderMpesa); // M-Pesa payment

// ========================
// Payment Verification Routes
// ========================
orderRouter.get('/chapa/verify/:tx_ref', authUser, verifyPayment); // Verify Chapa payment
orderRouter.post('/mpesa/callback', mpesaCallback); // M-Pesa callback (no auth needed)
orderRouter.get('/mpesa/status/:checkoutRequestId', authUser, checkMpesaStatus); // Check M-Pesa status

// ========================
// Test Routes
// ========================
orderRouter.get('/chapa/test', async (req, res) => {
  try {
    const { chapa } = await import('../config/chapaClient.js');
    const txRef = await chapa.genTxRef();
    res.json({ 
      success: true, 
      message: 'Chapa integration working', 
      sample_tx_ref: txRef 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

orderRouter.get('/mpesa/test', async (req, res) => {
  try {
    const { mpesa } = await import('../config/mpesaClient.js');
    res.json({ 
      success: true, 
      message: 'M-Pesa integration working',
      environment: process.env.MPESA_ENVIRONMENT || 'sandbox'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// ========================
// User Orders
// ========================
orderRouter.post('/userorders', authUser, userOrders); // Get user's own orders

export default orderRouter;
