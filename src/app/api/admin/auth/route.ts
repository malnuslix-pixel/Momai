import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  verifyAdminPassword,
  verifyAdminSessionToken,
} from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/auth
 * Checks whether the current request holds a valid admin session.
 */
export async function GET(req: NextRequest) {
  try {
    const cookieToken = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const authHeader = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    const token = cookieToken || authHeader;

    const isValid = await verifyAdminSessionToken(token);
    return NextResponse.json({
      ok: isValid,
      authenticated: isValid,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, authenticated: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/auth
 * Authenticates admin secret key and issues an HTTP-only session cookie.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { key } = body;

    if (!key || typeof key !== 'string') {
      return NextResponse.json(
        { ok: false, message: 'Admin secret key is required.' },
        { status: 400 }
      );
    }

    const isValid = verifyAdminPassword(key.trim());
    if (!isValid) {
      return NextResponse.json(
        { ok: false, message: 'Invalid admin secret key. Access denied.' },
        { status: 401 }
      );
    }

    const token = await createAdminSessionToken(86400); // 24-hour session
    const response = NextResponse.json({
      ok: true,
      message: 'Authentication successful.',
      token,
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 86400,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: 'Authentication internal error.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/auth
 * Clears the session cookie to securely sign out.
 */
export async function DELETE() {
  const response = NextResponse.json({
    ok: true,
    message: 'Signed out successfully.',
  });

  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
