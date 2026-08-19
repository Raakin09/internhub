import mongoose from 'mongoose';
const LoginHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    browser: { type: String, default: 'Unknown' },
    browserVersion: { type: String, default: '' },
    os: { type: String, default: 'Unknown' },
    osVersion: { type: String, default: '' },
    deviceType: { type: String, enum: ['desktop', 'mobile', 'tablet'], default: 'desktop' },
    deviceVendor: { type: String, default: '' },
    deviceModel: { type: String, default: '' },
    ipAddress: { type: String, default: '' },
    loginAt: { type: Date, default: Date.now },
    isSuccessful: { type: Boolean, default: true },
    otpVerified: { type: Boolean, default: false },
    failureReason: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);
LoginHistorySchema.index({ user: 1, loginAt: -1 });
export default mongoose.models.LoginHistory || mongoose.model('LoginHistory', LoginHistorySchema);
