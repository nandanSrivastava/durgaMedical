import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Medicine from '@/models/Medicine';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  try {
    const total = await Medicine.countDocuments();
    return NextResponse.json({ total });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching stats' }, { status: 500 });
  }
}
