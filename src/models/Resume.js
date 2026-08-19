import mongoose from 'mongoose';
const ResumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    photoUrl: { type: String, default: '' },
    summary: { type: String, default: '' },
    education: [
      {
        institution: String,
        degree: String,
        field: String,
        startYear: Number,
        endYear: Number,
        grade: String,
      },
    ],
    experience: [
      {
        company: String,
        role: String,
        description: String,
        startDate: String,
        endDate: String,
        isCurrent: Boolean,
      },
    ],
    skills: [{ type: String }],
    certifications: [{ name: String, issuer: String, year: Number }],
    projects: [{ title: String, description: String, link: String }],
    languages: [{ type: String }],
    hobbies: [{ type: String }],
    resumePdfUrl: { type: String, default: '' },
    isPremium: { type: Boolean, default: true },
    paymentId: { type: String, default: '' },
    amountPaid: { type: Number, default: 50 },
  },
  {
    timestamps: true,
  }
);
export default mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);
