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
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  let query = {};
  if (search) {
    query = { name: { $regex: search, $options: 'i' } };
  }

  try {
    const [medicines, total] = await Promise.all([
      Medicine.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Medicine.countDocuments(query)
    ]);

    return NextResponse.json({
      medicines,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
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
    const { name } = body;

    // Check for existing medicine with the same name (case-insensitive)
    const existingMedicine = await Medicine.findOne({ 
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } 
    });

    if (existingMedicine) {
      return NextResponse.json(
        { message: `A medicine with the name "${name}" already exists.` }, 
        { status: 400 }
      );
    }

    // Body now only contains name, mrp, purchaseRate
    const medicine = await Medicine.create(body);
    return NextResponse.json(medicine, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  try {
    const body = await request.json();
    const { _id, name, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ message: 'Medicine ID is required' }, { status: 400 });
    }

    // If name is being updated, check for duplicates excluding the current medicine
    if (name) {
      const existingMedicine = await Medicine.findOne({
        _id: { $ne: _id },
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
      });

      if (existingMedicine) {
        return NextResponse.json(
          { message: `A medicine with the name "${name}" already exists.` },
          { status: 400 }
        );
      }
      updateData.name = name;
    }

    const medicine = await Medicine.findByIdAndUpdate(_id, updateData, { new: true });
    
    if (!medicine) {
      return NextResponse.json({ message: 'Medicine not found' }, { status: 404 });
    }

    return NextResponse.json(medicine);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
