import mongoose from 'mongoose';
const JobSchema = new mongoose.Schema(
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
    location: { type: String, default: '' },
    workType: { type: String, enum: ['remote', 'hybrid', 'office'], default: 'office' },
    salaryMin: { type: Number, default: 0 },
    salaryMax: { type: Number, default: 0 },
    salaryType: { type: String, enum: ['yearly', 'monthly'], default: 'yearly' },
    experienceMin: { type: Number, default: 0 },
    experienceMax: { type: Number, default: 1 },
    experienceLevel: { type: String, enum: ['fresher', 'junior', 'mid', 'senior'], default: 'fresher' },
    openings: { type: Number, default: 1 },
    applicantCount: { type: Number, default: 0 },
    deadline: { type: Date, required: true },
    perks: [{ type: String }],
    status: { type: String, enum: ['active', 'closed', 'draft'], default: 'active' },
    isFeatured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
JobSchema.index({ title: 'text', company: 'text', category: 'text', skills: 'text' });
JobSchema.index({ category: 1, workType: 1, status: 1 });
export default mongoose.models.Job || mongoose.model('Job', JobSchema);
