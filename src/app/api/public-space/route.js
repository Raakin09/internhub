import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      Post.find({ isActive: true })
        .populate('author', 'name profilePhoto')
        .populate('comments.user', 'name profilePhoto')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments({ isActive: true }),
    ]);
    return NextResponse.json({
      posts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Get posts error:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { userId, content, mediaUrls, mediaType } = body;
    if (!userId || !content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const friendCount = user.friends ? user.friends.length : 0;
    if (friendCount === 0) {
      return NextResponse.json(
        {
          error: 'You need at least 1 friend to post in Public Space. Connect with other users first!',
          restriction: 'no_friends',
        },
        { status: 403 }
      );
    }
    if (friendCount <= 10) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const todayPostCount = await Post.countDocuments({
        author: userId,
        createdAt: { $gte: today, $lt: tomorrow },
      });
      let maxPosts;
      if (friendCount <= 2) {
        maxPosts = friendCount; 
      } else {
        maxPosts = friendCount; 
      }
      if (todayPostCount >= maxPosts) {
        return NextResponse.json(
          {
            error: `You've reached your daily post limit (${maxPosts} posts with ${friendCount} friends). Add more friends to post more!`,
            restriction: 'daily_limit',
            postsToday: todayPostCount,
            maxPosts,
          },
          { status: 403 }
        );
      }
    }
    const post = await Post.create({
      author: userId,
      content,
      mediaUrls: mediaUrls || [],
      mediaType: mediaType || 'none',
    });
    const populatedPost = await Post.findById(post._id)
      .populate('author', 'name profilePhoto')
      .lean();
    return NextResponse.json(
      { message: 'Post created!', post: populatedPost },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
