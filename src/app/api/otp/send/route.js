import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import OTP from '@/models/OTP';
import User from '@/models/User';
import { generateOTP, hashOTP } from '@/lib/utils';
import { sendOTPEmail } from '@/lib/email';
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { email, purpose } = body;
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    const validPurposes = ['login', 'language', 'resume', 'password', 'register'];
    if (!purpose || !validPurposes.includes(purpose)) {
      return NextResponse.json({ error: 'Invalid OTP purpose' }, { status: 400 });
    }
    if (purpose !== 'register') {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return NextResponse.json({ error: 'No account found with this email' }, { status: 404 });
      }
    }
    await OTP.updateMany(
      { email: email.toLowerCase(), purpose, isUsed: false },
      { isUsed: true }
    );
    const otp = generateOTP();
    const hashedOtp = hashOTP(otp);
    console.log(`\n\n🔑 OTP GENERATED FOR ${email} [${purpose}]: ${otp}\n\n`);
    await OTP.create({
      email: email.toLowerCase(),
      otp: hashedOtp,
      purpose,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    const purposeLabels = {
      login: 'login verification',
      language: 'language change verification',
      resume: 'resume payment verification',
      password: 'password reset',
      register: 'registration',
    };
    await sendOTPEmail(email, otp, purposeLabels[purpose]);
    return NextResponse.json({
      message: `OTP sent to ${email.replace(/(.{2})(.*)(@.*)/, '$1***$3')}`,
      expiresIn: '5 minutes',
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP. Please try again.' },
      { status: 500 }
    );
  }
}
