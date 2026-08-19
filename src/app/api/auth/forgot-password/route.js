import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import PasswordReset from '@/models/PasswordReset';
import { generateAlphaPassword, isToday } from '@/lib/utils';
import { sendPasswordResetEmail } from '@/lib/email';
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { emailOrPhone } = body;
    if (!emailOrPhone) {
      return NextResponse.json(
        { error: 'Please provide your email or phone number' },
        { status: 400 }
      );
    }
    const user = await User.findOne({
      $or: [
        { email: emailOrPhone.toLowerCase() },
        { phone: emailOrPhone },
      ],
    });
    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email or phone number' },
        { status: 404 }
      );
    }
    const resetRecord = await PasswordReset.findOne({ user: user._id });
    if (resetRecord && isToday(resetRecord.lastResetAt)) {
      return NextResponse.json(
        {
          error: 'You can use this option only once per day.',
          warning: true,
          lastReset: resetRecord.lastResetAt,
        },
        { status: 429 }
      );
    }
    const newPassword = generateAlphaPassword(10);
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
    if (resetRecord) {
      resetRecord.lastResetAt = new Date();
      resetRecord.resetCount += 1;
      await resetRecord.save();
    } else {
      await PasswordReset.create({
        user: user._id,
        email: user.email,
        lastResetAt: new Date(),
      });
    }
    await sendPasswordResetEmail(user.email, newPassword);
    return NextResponse.json({
      message: 'A new password has been sent to your registered email address.',
      email: user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3'), 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
