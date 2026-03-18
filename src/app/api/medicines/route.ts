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
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');

  let query = {};
  if (search) {
    query = { name: { $regex: search, $options: 'i' } };
  }

  try {
    const medicines = await Medicine.find(query).sort({ createdAt: -1 });
    return NextResponse.json(medicines);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching medicines' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  try {
    const body = await request.json();
    // Body now only contains name, mrp, purchaseRate
    const medicine = await Medicine.create(body);
    return NextResponse.json(medicine, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
