import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Application from '@/models/Application';
export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { status, feedback } = body;
    const validStatuses = ['applied', 'reviewed', 'shortlisted', 'hired', 'rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    const application = await Application.findById(id);
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }
    application.status = status;
    if (feedback) application.feedback = feedback;
    application.statusHistory.push({ status, changedAt: new Date(), note: feedback || '' });
    await application.save();
    return NextResponse.json({ message: 'Application status updated', application });
  } catch (error) {
    console.error('Update application error:', error);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}
