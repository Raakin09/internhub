import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import LoginHistory from '@/models/LoginHistory';
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }
    const user = await User.findById(userId)
      .select('-password')
      .populate('subscription')
      .populate('resume')
      .lean();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}
export async function PATCH(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { userId, ...updateData } = body;
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }
    delete updateData.password;
    delete updateData.email;
    delete updateData.role;
    delete updateData.plan;
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      select: '-password',
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Profile updated', user });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
