import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Application from '@/models/Application';
import User from '@/models/User';
import Internship from '@/models/Internship';
import Job from '@/models/Job';
import { SUBSCRIPTION_PLANS } from '@/lib/utils';
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const employerId = searchParams.get('employerId');
    const status = searchParams.get('status');
    
    if (userId) {
      const filter = { user: userId };
      if (status) filter.status = status;
      const applications = await Application.find(filter)
        .populate('listing')
        .sort({ createdAt: -1 })
        .lean();
      return NextResponse.json({ applications });
    } else if (employerId) {
      const internships = await Internship.find({ postedBy: employerId }).select('_id title company');
      const jobs = await Job.find({ postedBy: employerId }).select('_id title company');
      const listingIds = [...internships.map(i => i._id), ...jobs.map(j => j._id)];
      
      const filter = { listing: { $in: listingIds } };
      if (status) filter.status = status;
      
      const applications = await Application.find(filter)
        .populate('listing')
        .populate('user', 'name email phone resume')
        .sort({ createdAt: -1 })
        .lean();
      return NextResponse.json({ applications });
    } else {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
  } catch (error) {
    console.error('Get applications error:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { userId, listingId, listingType, coverLetter } = body;
    if (!userId || !listingId || !listingType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const now = new Date();
    const lastReset = new Date(user.lastApplicationReset);
    if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
      user.applicationsThisMonth = 0;
      user.lastApplicationReset = now;
      await user.save();
    }
    const plan = SUBSCRIPTION_PLANS[user.plan] || SUBSCRIPTION_PLANS.free;
    if (user.applicationsThisMonth >= plan.maxApplications) {
      return NextResponse.json(
        {
          error: `You've reached your monthly application limit (${plan.maxApplications}) for the ${plan.name} plan. Upgrade to apply more!`,
          limitReached: true,
          currentPlan: user.plan,
        },
        { status: 403 }
      );
    }
    const existingApp = await Application.findOne({ user: userId, listing: listingId });
    if (existingApp) {
      return NextResponse.json(
        { error: 'You have already applied for this position' },
        { status: 409 }
      );
    }
    const listingModel = listingType === 'internship' ? 'Internship' : 'Job';
    const application = await Application.create({
      user: userId,
      listing: listingId,
      listingModel,
      listingType,
      coverLetter: coverLetter || '',
      resume: user.resume,
      statusHistory: [{ status: 'applied', changedAt: new Date() }],
    });
    user.applicationsThisMonth += 1;
    await user.save();
    const Model = listingType === 'internship' ? Internship : Job;
    await Model.findByIdAndUpdate(listingId, { $inc: { applicantCount: 1 } });
    return NextResponse.json(
      {
        message: 'Application submitted successfully! 🎉',
        application,
        applicationsRemaining: plan.maxApplications === Infinity ? 'Unlimited' : plan.maxApplications - user.applicationsThisMonth,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Apply error:', error);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}
