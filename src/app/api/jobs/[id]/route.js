import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const job = await Job.findById(id).populate('postedBy', 'name companyName companyLogo companyDescription').lean();
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    const similar = await Job.find({
      _id: { $ne: id },
      category: job.category,
      status: 'active',
    }).limit(4).lean();
    return NextResponse.json({ job, similar });
  } catch (error) {
    console.error('Get job error:', error);
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 });
  }
}
