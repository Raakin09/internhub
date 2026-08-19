import mongoose from 'mongoose';
const PasswordResetSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    email: { type: String, required: true, lowercase: true },
    lastResetAt: { type: Date, default: Date.now },
    resetCount: { type: Number, default: 1 },
  },
  {
    timestamps: true,
  }
);
PasswordResetSchema.index({ user: 1 });
PasswordResetSchema.index({ email: 1 });
export default mongoose.models.PasswordReset || mongoose.model('PasswordReset', PasswordResetSchema);
