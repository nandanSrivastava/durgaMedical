import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Medicine from '@/models/Medicine';
import { getSession } from '@/lib/auth';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  await dbConnect();
  try {
    const medicine = await Medicine.findByIdAndDelete(id);
    if (!medicine) {
      return NextResponse.json({ message: 'Medicine not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Medicine deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
