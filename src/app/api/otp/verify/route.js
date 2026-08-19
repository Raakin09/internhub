import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import OTP from '@/models/OTP';
import { hashOTP } from '@/lib/utils';
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { email, otp, purpose } = body;
    if (!email || !otp || !purpose) {
      return NextResponse.json(
        { error: 'Email, OTP, and purpose are required' },
        { status: 400 }
      );
    }
    const hashedOtp = hashOTP(otp);
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      otp: hashedOtp,
      purpose,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });
    if (!otpRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP. Please request a new one.' },
        { status: 400 }
      );
    }
    otpRecord.isUsed = true;
    await otpRecord.save();
    return NextResponse.json({
      message: 'OTP verified successfully',
      verified: true,
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: 'OTP verification failed. Please try again.' },
      { status: 500 }
    );
  }
}
