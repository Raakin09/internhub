import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
export async function POST(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const { userId, action } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    if (action === 'like') {
      const alreadyLiked = post.likes.includes(userId);
      if (alreadyLiked) {
        post.likes = post.likes.filter((id) => id.toString() !== userId);
        post.likeCount = Math.max(0, post.likeCount - 1);
      } else {
        post.likes.push(userId);
        post.likeCount += 1;
      }
      await post.save();
      return NextResponse.json({
        liked: !alreadyLiked,
        likeCount: post.likeCount,
      });
    }
    if (action === 'comment') {
      const { text } = await request.json();
      post.comments.push({ user: userId, text, createdAt: new Date() });
      post.commentCount += 1;
      await post.save();
      return NextResponse.json({ message: 'Comment added', commentCount: post.commentCount });
    }
    if (action === 'share') {
      post.shares += 1;
      await post.save();
      return NextResponse.json({ shares: post.shares });
    }
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Post action error:', error);
    return NextResponse.json({ error: 'Action failed' }, { status: 500 });
  }
}
