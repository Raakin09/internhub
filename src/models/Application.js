import mongoose from 'mongoose';
const ApplicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    listing: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'listingModel' },
    listingModel: { type: String, enum: ['Internship', 'Job'], required: true },
    listingType: { type: String, enum: ['internship', 'job'], required: true },
    status: {
      type: String,
      enum: ['applied', 'reviewed', 'shortlisted', 'hired', 'rejected'],
      default: 'applied',
    },
    coverLetter: { type: String, default: '' },
    resume: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
    feedback: { type: String, default: '' },
    interviewDate: { type: Date },
    statusHistory: [
      {
        status: String,
        changedAt: { type: Date, default: Date.now },
        note: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);
ApplicationSchema.index({ user: 1, listing: 1 }, { unique: true });
ApplicationSchema.index({ user: 1, status: 1 });
export default mongoose.models.Application || mongoose.model('Application', ApplicationSchema);
