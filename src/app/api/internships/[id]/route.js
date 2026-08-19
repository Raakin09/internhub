import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Internship from '@/models/Internship';
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const internship = await Internship.findById(id).populate('postedBy', 'name companyName companyLogo companyDescription').lean();
    if (!internship) {
      return NextResponse.json({ error: 'Internship not found' }, { status: 404 });
    }
    const similar = await Internship.find({
      _id: { $ne: id },
      category: internship.category,
      status: 'active',
    })
      .limit(4)
      .lean();
    return NextResponse.json({ internship, similar });
  } catch (error) {
    console.error('Get internship error:', error);
    return NextResponse.json({ error: 'Failed to fetch internship' }, { status: 500 });
  }
}
