import mongoose from 'mongoose';
const SubscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plan: { type: String, enum: ['free', 'bronze', 'silver', 'gold'], required: true },
    price: { type: Number, required: true },
    maxApplications: { type: Number, required: true },
    razorpayOrderId: { type: String, default: '' },
    razorpayPaymentId: { type: String, default: '' },
    razorpaySignature: { type: String, default: '' },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    invoiceSent: { type: Boolean, default: false },
    invoiceSentAt: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);
SubscriptionSchema.index({ user: 1, isActive: 1 });
export default mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema);
