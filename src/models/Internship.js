import mongoose from 'mongoose';
const InternshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true },
    companyLogo: { type: String, default: '' },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    responsibilities: [{ type: String }],
    requirements: [{ type: String }],
    category: { type: String, required: true },
    skills: [{ type: String }],
    location: { type: String, default: 'Remote' },
    workType: { type: String, enum: ['remote', 'hybrid', 'office'], default: 'remote' },
    stipendMin: { type: Number, default: 0 },
    stipendMax: { type: Number, default: 0 },
    stipendType: { type: String, enum: ['monthly', 'lumpsum', 'unpaid'], default: 'monthly' },
    duration: { type: String, default: '3 months' },
    startDate: { type: Date },
    deadline: { type: Date, required: true },
    openings: { type: Number, default: 1 },
    applicantCount: { type: Number, default: 0 },
    isPPO: { type: Boolean, default: false },
    perks: [{ type: String }],
    status: { type: String, enum: ['active', 'closed', 'draft'], default: 'active' },
    isFeatured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
InternshipSchema.index({ title: 'text', company: 'text', category: 'text', skills: 'text' });
InternshipSchema.index({ category: 1, workType: 1, status: 1 });
export default mongoose.models.Internship || mongoose.model('Internship', InternshipSchema);
