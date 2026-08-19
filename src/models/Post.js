import mongoose from 'mongoose';
const PostSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 2000 },
    mediaUrls: [{ type: String }],
    mediaType: { type: String, enum: ['none', 'photo', 'video'], default: 'none' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likeCount: { type: Number, default: 0 },
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: { type: String, required: true, maxlength: 500 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    commentCount: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    reportCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);
PostSchema.index({ author: 1, createdAt: -1 });
PostSchema.index({ createdAt: -1 });
export default mongoose.models.Post || mongoose.model('Post', PostSchema);
