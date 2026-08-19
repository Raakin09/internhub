import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Subscription from '@/models/Subscription';
import { createRazorpayOrder, verifyRazorpaySignature } from '@/lib/razorpay';
import { sendInvoiceEmail } from '@/lib/email';
import { isPaymentTimeAllowed, SUBSCRIPTION_PLANS, formatDate, generateReceiptId } from '@/lib/utils';
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { userId, plan, paymentType } = body;
    if (!userId || !plan) {
      return NextResponse.json({ error: 'User ID and plan are required' }, { status: 400 });
    }
    if (paymentType === 'subscription') {
      const timeCheck = isPaymentTimeAllowed();
      if (!timeCheck.allowed) {
        return NextResponse.json(
          {
            error: timeCheck.message,
            restriction: 'payment_time',
            currentTime: timeCheck.currentTimeIST,
          },
          { status: 403 }
        );
      }
    }
    let amount, description;
    if (paymentType === 'resume') {
      amount = 50;
      description = 'Resume Builder - Premium Resume';
    } else {
      const planDetails = SUBSCRIPTION_PLANS[plan];
      if (!planDetails || plan === 'free') {
        return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
      }
      amount = planDetails.price;
      description = `InternHub ${planDetails.name} Plan - ${planDetails.duration}`;
    }
    const order = await createRazorpayOrder(amount, 'INR', generateReceiptId(), {
      userId,
      plan,
      paymentType,
    });
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      description,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
  }
}
export async function PUT(request) {
  try {
    await connectDB();
    const body = await request.json();
    const {
      userId, plan, paymentType,
      razorpay_order_id, razorpay_payment_id, razorpay_signature,
    } = body;
    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );
    if (!isValid) {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
    }
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    if (paymentType === 'subscription') {
      const planDetails = SUBSCRIPTION_PLANS[plan];
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
      await Subscription.updateMany(
        { user: userId, isActive: true },
        { isActive: false }
      );
      const subscription = await Subscription.create({
        user: userId,
        plan,
        price: planDetails.price,
        maxApplications: planDetails.maxApplications === Infinity ? 999999 : planDetails.maxApplications,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        startDate,
        endDate,
      });
      user.plan = plan;
      user.subscription = subscription._id;
      user.applicationsThisMonth = 0;
      await user.save();
      await sendInvoiceEmail(user.email, {
        planName: planDetails.name,
        price: planDetails.price,
        duration: planDetails.duration,
        paymentId: razorpay_payment_id,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
      });
      subscription.invoiceSent = true;
      subscription.invoiceSentAt = new Date();
      await subscription.save();
      return NextResponse.json({
        message: `${planDetails.name} Plan activated successfully! Invoice sent to ${user.email}`,
        subscription,
      });
    }
    return NextResponse.json({ message: 'Payment verified successfully', verified: true });
  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
  }
}
