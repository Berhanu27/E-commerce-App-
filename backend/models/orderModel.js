import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, default: 'Order placed' },
  paymentMethod: { type: String, required: true },
  payment: { type: Boolean, default: false },
  date: { type: Number, required: true },
  tx_ref: { type: String }, // For Chapa payment reference
  checkoutRequestId: { type: String }, // For M-Pesa payment reference
  mpesaReceiptNumber: { type: String } // M-Pesa receipt number
});

const orderModel =
  mongoose.models.Order || mongoose.model('Order', orderSchema);

export default orderModel;
