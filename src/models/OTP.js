import mongoose from 'mongoose';
const OTPSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true },
    otp: { type: String, required: true }, 
    purpose: {
      type: String,
      enum: ['login', 'language', 'resume', 'password', 'register'],
      required: true,
    },
    expiresAt: { type: Date, required: true },
    isUsed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
OTPSchema.index({ email: 1, purpose: 1 });
export default mongoose.models.OTP || mongoose.model('OTP', OTPSchema);
