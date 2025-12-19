// backend/config/mpesaClient.js
import dotenv from 'dotenv';

dotenv.config();

// IMPORTANT: This is a simplified implementation for development/testing
// To use the real M-Pesa SDK, replace this with:
// import { Mpesa } from '@safaricom-et/mpesa-node-js-sdk';
// export const mpesa = new Mpesa({
//   apiKey: process.env.MPESA_CONSUMER_KEY,
//   secretKey: process.env.MPESA_CONSUMER_SECRET,
//   environment: process.env.MPESA_ENVIRONMENT || 'sandbox',
// });

class SimpleMpesa {
  constructor(config) {
    this.config = config;
    console.log('M-Pesa client initialized in', config.environment, 'mode');
  }
  
  async stkPush(payload) {
    console.log('M-Pesa STK Push simulation with payload:', payload);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For development/testing, return a mock successful response
    return {
      ResponseCode: '0',
      ResponseDescription: 'Success. Request accepted for processing',
      MerchantRequestID: 'mock-merchant-' + Date.now(),
      CheckoutRequestID: 'ws_CO_' + Date.now() + Math.random().toString(36).substr(2, 9),
      CustomerMessage: 'Success. Request accepted for processing'
    };
  }
}

export const mpesa = new SimpleMpesa({
  apiKey: process.env.MPESA_CONSUMER_KEY || 'dummy_key',
  secretKey: process.env.MPESA_CONSUMER_SECRET || 'dummy_secret',
  environment: process.env.MPESA_ENVIRONMENT || 'sandbox',
});

// Helper function to generate timestamp
export const generateTimestamp = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

// Helper function to generate password
export const generatePassword = (shortCode, passkey, timestamp) => {
  const data = shortCode + passkey + timestamp;
  return Buffer.from(data).toString('base64');
};

export default mpesa;