import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const skip = (page - 1) * limit;
    const filter = { status: 'active' };
    const category = searchParams.get('category');
    if (category) filter.category = category;
    const workType = searchParams.get('workType');
    if (workType) filter.workType = workType;
    const location = searchParams.get('location');
    if (location) filter.location = { $regex: location, $options: 'i' };
    const experienceLevel = searchParams.get('experience');
    if (experienceLevel) filter.experienceLevel = experienceLevel;
    const search = searchParams.get('search');
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } },
      ];
    }
    const sortBy = searchParams.get('sort') || 'newest';
    let sort = {};
    switch (sortBy) {
      case 'newest': sort = { createdAt: -1 }; break;
      case 'salary_high': sort = { salaryMax: -1 }; break;
      case 'salary_low': sort = { salaryMin: 1 }; break;
      default: sort = { createdAt: -1 };
    }
    const [jobs, total] = await Promise.all([
      Job.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Job.countDocuments(filter),
    ]);
    return NextResponse.json({
      jobs,
      pagination: {
        page, limit, total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { userId, ...jobData } = body;
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const job = await Job.create({ ...jobData, postedBy: userId });
    return NextResponse.json({ message: 'Job posted successfully', job }, { status: 201 });
  } catch (error) {
    console.error('Create job error:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}
