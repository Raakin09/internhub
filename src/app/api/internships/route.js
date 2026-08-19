import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Internship from '@/models/Internship';
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
    const minStipend = searchParams.get('minStipend');
    if (minStipend) filter.stipendMin = { $gte: parseInt(minStipend) };
    const maxStipend = searchParams.get('maxStipend');
    if (maxStipend) filter.stipendMax = { $lte: parseInt(maxStipend) };
    const duration = searchParams.get('duration');
    if (duration) filter.duration = { $regex: duration, $options: 'i' };
    const isPPO = searchParams.get('isPPO');
    if (isPPO === 'true') filter.isPPO = true;
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
      case 'stipend_high': sort = { stipendMax: -1 }; break;
      case 'stipend_low': sort = { stipendMin: 1 }; break;
      case 'deadline': sort = { deadline: 1 }; break;
      default: sort = { createdAt: -1 };
    }
    const [internships, total] = await Promise.all([
      Internship.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Internship.countDocuments(filter),
    ]);
    return NextResponse.json({
      internships,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.error('Get internships error:', error);
    return NextResponse.json({ error: 'Failed to fetch internships' }, { status: 500 });
  }
}
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { userId, ...internshipData } = body;
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const internship = await Internship.create({
      ...internshipData,
      postedBy: userId,
    });
    return NextResponse.json(
      { message: 'Internship posted successfully', internship },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create internship error:', error);
    return NextResponse.json({ error: 'Failed to create internship' }, { status: 500 });
  }
}
