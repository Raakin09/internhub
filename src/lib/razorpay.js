import Razorpay from 'razorpay';
let razorpayInstance = null;
export function getRazorpayInstance() {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
}
export async function createRazorpayOrder(amount, currency = 'INR', receipt = '', notes = {}) {
  const razorpay = getRazorpayInstance();
  const options = {
    amount: amount * 100, 
    currency,
    receipt: receipt || `receipt_${Date.now()}`,
    notes,
  };
  const order = await razorpay.orders.create(options);
  return order;
}
export function verifyRazorpaySignature(orderId, paymentId, signature) {
  const crypto = require('crypto');
  const body = orderId + '|' + paymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');
  return expectedSignature === signature;
}
