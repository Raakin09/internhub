import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import LoginHistory from '@/models/LoginHistory';
import { parseUserAgent, getClientIP, isChromeBrowser, isMobileDevice, isMobileLoginTimeAllowed } from '@/lib/utils';
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { email, password, otpVerified } = body;
    const userAgent = request.headers.get('user-agent') || '';
    const deviceInfo = parseUserAgent(userAgent);
    const clientIP = getClientIP(request);
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await LoginHistory.create({
        user: user._id,
        ...deviceInfo,
        ipAddress: clientIP,
        isSuccessful: false,
        failureReason: 'Invalid password',
      });
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    if (isMobileDevice(userAgent)) {
      const timeCheck = isMobileLoginTimeAllowed();
      if (!timeCheck.allowed) {
        await LoginHistory.create({
          user: user._id,
          ...deviceInfo,
          ipAddress: clientIP,
          isSuccessful: false,
          failureReason: 'Mobile login outside allowed time window',
        });
        return NextResponse.json(
          {
            error: 'Mobile login is only available between 10:00 AM and 1:00 PM IST',
            currentTime: timeCheck.currentTimeIST,
            restriction: 'mobile_time',
          },
          { status: 403 }
        );
      }
    }
    if (isChromeBrowser(userAgent) && !otpVerified) {
      return NextResponse.json(
        {
          requiresOTP: true,
          message: 'Chrome browser detected. OTP verification required.',
          email: user.email,
          restriction: 'chrome_otp',
        },
        { status: 200 }
      );
    }
    await LoginHistory.create({
      user: user._id,
      ...deviceInfo,
      ipAddress: clientIP,
      isSuccessful: true,
      otpVerified: otpVerified || false,
    });
    const userData = user.toObject();
    delete userData.password;
    return NextResponse.json({
      message: 'Login successful',
      user: userData,
      deviceInfo: {
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        deviceType: deviceInfo.deviceType,
        ip: clientIP,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
