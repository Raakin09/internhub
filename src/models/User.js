import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'employer'], default: 'student' },
    firebaseUid: { type: String, default: '' },
    profilePhoto: { type: String, default: '' },
    bio: { type: String, default: '', maxlength: 500 },
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
    skills: [{ type: String }],
    experience: [
      {
        company: String,
        role: String,
        description: String,
        startDate: Date,
        endDate: Date,
        isCurrent: { type: Boolean, default: false },
      },
    ],
    location: { type: String, default: '' },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
    plan: { type: String, enum: ['free', 'bronze', 'silver', 'gold'], default: 'free' },
    applicationsThisMonth: { type: Number, default: 0 },
    lastApplicationReset: { type: Date, default: Date.now },
    resume: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
    language: { type: String, default: 'en' },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true },
    },
    companyName: { type: String, default: '' },
    companyLogo: { type: String, default: '' },
    companyWebsite: { type: String, default: '' },
    companyDescription: { type: String, default: '' },
    companySize: { type: String, default: '' },
    industry: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);
UserSchema.index({ name: 'text', email: 'text', skills: 'text' });
export default mongoose.models.User || mongoose.model('User', UserSchema);
