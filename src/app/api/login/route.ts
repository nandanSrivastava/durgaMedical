import { NextResponse } from 'next/server';
import { encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    // Create session
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const session = await encrypt({ username, expires });

    // Set cookie
    (await cookies()).set('session', session, {
      expires,
      httpOnly: true,
      secure: process.env.NODE_BIT === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json(
    { success: false, message: 'Invalid credentials' },
    { status: 401 }
  );
}
