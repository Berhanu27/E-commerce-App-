import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import axios from "axios";
import dotenv from "dotenv";
import { chapa } from '../config/chapaClient.js';
import { mpesa, generateTimestamp, generatePassword } from '../config/mpesaClient.js';

dotenv.config();

const currency = "ETB";

// ========================
// 1️⃣ Place Order – Cash on Delivery
// ========================
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    if (!userId || !items || !amount || !address) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    await orderModel.create({
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      status: "Order placed",
      date: Date.now(),
    });

    // Clear user's cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// ========================
// 2️⃣ Place Order – Chapa Payment
// ========================
const placeOrderChapa = async (req, res) => {
  try {
    console.log("=== CHAPA PAYMENT REQUEST ===");
    console.log("Headers:", req.headers);
    console.log("Body:", JSON.stringify(req.body, null, 2));
    
    const { items, amount, address, userId } = req.body;
    const origin = req.headers.origin || "http://localhost:5174";

    // Extract user info from address
    const email = address?.email;
    const firstName = address?.firstName;
    const lastName = address?.lastName;

    console.log("Extracted data:", { 
      userId, 
      email, 
      firstName, 
      lastName, 
      itemsCount: items?.length, 
      amount,
      hasAddress: !!address 
    });

    // Validate required fields
    const missingFields = [];
    if (!userId) missingFields.push("userId");
    if (!items || !Array.isArray(items) || items.length === 0) missingFields.push("items");
    if (!amount || amount <= 0) missingFields.push("amount");
    if (!address) missingFields.push("address");
    if (!email) missingFields.push("email");
    if (!firstName) missingFields.push("firstName");
    if (!lastName) missingFields.push("lastName");

    if (missingFields.length > 0) {
      console.log("Missing fields:", missingFields);
      return res.status(400).json({ 
        success: false, 
        message: `Missing required fields: ${missingFields.join(", ")}`,
        missingFields,
        receivedData: { 
          userId: !!userId, 
          items: items?.length || 0, 
          amount, 
          address: !!address, 
          email: !!email, 
          firstName: !!firstName, 
          lastName: !!lastName 
        }
      });
    }

    const newOrder = await orderModel.create({
      userId,
      items,
      amount,
      address,
      paymentMethod: "Chapa",
      payment: false,
      status: "Pending payment",
      date: Date.now(),
    });

    // Generate transaction reference
    const tx_ref = await chapa.genTxRef();

    // Initialize payment with Chapa
    const response = await chapa.initialize({
      amount,
      currency,
      email,
      first_name: firstName,
      last_name: lastName,
      tx_ref,
      callback_url: `${origin}/payment/success?orderId=${newOrder._id}`,
      return_url: `${origin}/payment/success?orderId=${newOrder._id}`,
      customization: {
        title: "Order Payment",
        description: `Payment for order ${newOrder._id}`
      },
      meta: { 
        orderId: newOrder._id.toString() 
      }
    });

    // Update order with transaction reference
    await orderModel.findByIdAndUpdate(newOrder._id, { tx_ref });

    res.json({ 
      success: true, 
      checkout_url: response.data.checkout_url,
      tx_ref 
    });
  } catch (error) {
    console.error("Chapa Error:", error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Chapa payment failed" 
    });
  }
};

// ========================
// 3️⃣ Place Order – M-Pesa Payment
// ========================
const placeOrderMpesa = async (req, res) => {
  try {
    console.log("=== MPESA PAYMENT REQUEST ===");
    console.log("Headers:", req.headers);
    console.log("Body:", JSON.stringify(req.body, null, 2));
    
    const { items, amount, address, userId, phoneNumber } = req.body;

    // Validate required fields
    const missingFields = [];
    if (!userId) missingFields.push("userId");
    if (!items || !Array.isArray(items) || items.length === 0) missingFields.push("items");
    if (!amount || amount <= 0) missingFields.push("amount");
    if (!address) missingFields.push("address");
    if (!phoneNumber) missingFields.push("phoneNumber");

    if (missingFields.length > 0) {
      console.log("Missing fields:", missingFields);
      return res.status(400).json({ 
        success: false, 
        message: `Missing required fields: ${missingFields.join(", ")}`,
        missingFields
      });
    }

    // Validate phone number format (should be 254XXXXXXXXX)
    const cleanPhone = phoneNumber.replace(/\D/g, ''); // Remove non-digits
    let formattedPhone;
    
    if (cleanPhone.startsWith('254')) {
      formattedPhone = cleanPhone;
    } else if (cleanPhone.startsWith('0')) {
      formattedPhone = '254' + cleanPhone.substring(1);
    } else if (cleanPhone.startsWith('7') || cleanPhone.startsWith('1')) {
      formattedPhone = '254' + cleanPhone;
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number format. Use format: 254XXXXXXXXX or 07XXXXXXXX"
      });
    }

    console.log("Formatted phone:", formattedPhone);

    // Create order first
    const newOrder = await orderModel.create({
      userId,
      items,
      amount,
      address,
      paymentMethod: "M-Pesa",
      payment: false,
      status: "Pending payment",
      date: Date.now(),
    });

    // Generate M-Pesa payment request
    const timestamp = generateTimestamp();
    const password = generatePassword(
      process.env.MPESA_BUSINESS_SHORT_CODE,
      process.env.MPESA_PASSKEY,
      timestamp
    );

    const stkPayload = {
      BusinessShortCode: process.env.MPESA_BUSINESS_SHORT_CODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount), // M-Pesa requires integer amount
      PartyA: formattedPhone,
      PartyB: process.env.MPESA_BUSINESS_SHORT_CODE,
      PhoneNumber: formattedPhone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: newOrder._id.toString(),
      TransactionDesc: `Payment for order ${newOrder._id}`,
    };

    console.log("STK Push payload:", stkPayload);

    // Initiate STK Push
    const response = await mpesa.stkPush(stkPayload);
    console.log('STK Push Response:', response);

    if (response.ResponseCode === '0') {
      // Update order with checkout request ID
      await orderModel.findByIdAndUpdate(newOrder._id, { 
        checkoutRequestId: response.CheckoutRequestID 
      });

      res.json({
        success: true,
        message: "STK Push sent successfully. Please check your phone.",
        checkoutRequestId: response.CheckoutRequestID,
        orderId: newOrder._id
      });
    } else {
      // Delete the order if STK push failed
      await orderModel.findByIdAndDelete(newOrder._id);
      
      res.status(400).json({
        success: false,
        message: response.ResponseDescription || "STK Push failed",
        errorCode: response.ResponseCode
      });
    }

  } catch (error) {
    console.error("M-Pesa Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "M-Pesa payment failed" 
    });
  }
};

// ========================
// 4️⃣ M-Pesa Callback Handler
// ========================
const mpesaCallback = async (req, res) => {
  try {
    console.log("=== MPESA CALLBACK ===");
    console.log("Callback body:", JSON.stringify(req.body, null, 2));

    const { Body } = req.body;
    const { stkCallback } = Body;

    if (stkCallback.ResultCode === 0) {
      // Payment successful
      const checkoutRequestId = stkCallback.CheckoutRequestID;
      const mpesaReceiptNumber = stkCallback.CallbackMetadata.Item.find(
        item => item.Name === 'MpesaReceiptNumber'
      )?.Value;

      // Update order status
      const order = await orderModel.findOneAndUpdate(
        { checkoutRequestId },
        {
          payment: true,
          status: 'Paid',
          mpesaReceiptNumber
        },
        { new: true }
      );

      if (order) {
        // Clear user's cart after successful payment
        await userModel.findByIdAndUpdate(order.userId, { cartData: {} });
        console.log(`Order ${order._id} payment confirmed`);
      }

    } else {
      // Payment failed
      const checkoutRequestId = stkCallback.CheckoutRequestID;
      await orderModel.findOneAndUpdate(
        { checkoutRequestId },
        { status: 'Payment failed' }
      );
      
      console.log(`Payment failed for checkout: ${checkoutRequestId}`);
    }

    // Always respond with success to M-Pesa
    res.json({ ResultCode: 0, ResultDesc: "Success" });

  } catch (error) {
    console.error("M-Pesa callback error:", error);
    res.json({ ResultCode: 1, ResultDesc: "Error processing callback" });
  }
};

// ========================
// 5️⃣ Check M-Pesa Payment Status
// ========================
const checkMpesaStatus = async (req, res) => {
  try {
    const { checkoutRequestId } = req.params;

    if (!checkoutRequestId) {
      return res.status(400).json({
        success: false,
        message: "Checkout Request ID is required"
      });
    }

    // Find order by checkout request ID
    const order = await orderModel.findOne({ checkoutRequestId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.json({
      success: true,
      order: {
        _id: order._id,
        status: order.status,
        payment: order.payment,
        mpesaReceiptNumber: order.mpesaReceiptNumber
      }
    });

  } catch (error) {
    console.error("Check M-Pesa status error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ========================
// 4️⃣ Verify Chapa Payment
// ========================
const verifyPayment = async (req, res) => {
  try {
    const { tx_ref } = req.params;

    if (!tx_ref) {
      return res.status(400).json({ 
        success: false, 
        message: 'Transaction reference is required' 
      });
    }

    const response = await chapa.verify({ tx_ref });
    const transaction = response.data;

    if (transaction.status === 'success') {
      // Find order by tx_ref and update payment status
      const order = await orderModel.findOneAndUpdate(
        { tx_ref },
        {
          payment: true,
          status: 'Paid',
        },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ 
          success: false, 
          message: 'Order not found' 
        });
      }

      // Clear user's cart after successful payment
      await userModel.findByIdAndUpdate(order.userId, { cartData: {} });

      return res.json({ 
        success: true, 
        message: 'Payment verified successfully', 
        transaction,
        order 
      });
    }

    return res.json({ 
      success: false, 
      message: 'Payment not successful', 
      transaction 
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    const message = error.response?.data?.message || error.message || 'Internal server error';
    res.status(error.response?.status || 500).json({ 
      success: false, 
      message 
    });
  }
};

// ========================
// 5️⃣ Admin – Get All Orders
// ========================
const allOrder = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// ========================
// 6️⃣ User – Get Own Orders
// ========================
const userOrders = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    if (!userId) return res.json({ success: false, message: "User not authenticated" });

    const orders = await orderModel.find({ userId }).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// ========================
// 7️⃣ Admin – Update Order Status
// ========================
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    if (!orderId || !status) return res.json({ success: false, message: "Missing orderId or status" });

    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Order status updated" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// ========================
// Export All
// ========================
export {
  placeOrder,
  placeOrderChapa,
  placeOrderMpesa,
  allOrder,
  userOrders,
  updateStatus,
  verifyPayment,
  mpesaCallback,
  checkMpesaStatus,
};
