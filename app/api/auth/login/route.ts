import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    // Demo users - No password required for demo access
    const validUsers = [
      { username: 'demo', role: 'viewer' },
      { username: 'admin', role: 'admin' },
      { username: 'theatremanager', role: 'manager' }
    ];

    const user = validUsers.find(
      u => u.username.toLowerCase() === username.toLowerCase()
    );

    if (user) {
      const response = NextResponse.json(
        { success: true, message: 'Demo access granted', user: { username: user.username, role: user.role } },
        { status: 200 }
      );

      // Set HTTP-only cookie for security
      response.cookies.set('tom_authenticated', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 8, // 8 hours
        path: '/',
      });

      response.cookies.set('tom_user', user.username, {
        httpOnly: false, // Accessible by client for display
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 8,
        path: '/',
      });

      return response;
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid username. Please use: demo, admin, or theatremanager' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
