import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import LoginHistory from '@/models/LoginHistory';
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const skip = (page - 1) * limit;
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }
    const [history, total] = await Promise.all([
      LoginHistory.find({ user: userId })
        .sort({ loginAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      LoginHistory.countDocuments({ user: userId }),
    ]);
    return NextResponse.json({
      history,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Get login history error:', error);
    return NextResponse.json({ error: 'Failed to fetch login history' }, { status: 500 });
  }
}
