import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  extractAdminSession,
  hashAdminPassword,
  verifyAdminPassword,
  verifyAdminPasswordHash,
} from '@/lib/auth';
import { getAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

interface StoredAdminAccount {
  id: string;
  email: string;
  name?: string;
  salt: string;
  hash: string;
  createdAt: string;
}

const ADMIN_ACCOUNTS_KEY = 'admin_accounts';
let memoryAccounts: StoredAdminAccount[] = [];

async function loadAdminAccounts(): Promise<StoredAdminAccount[]> {
  try {
    const db = getAdminClient();
    const { data, error } = await db
      .from('site_config')
      .select('value')
      .eq('key', ADMIN_ACCOUNTS_KEY)
      .single();

    if (!error && Array.isArray(data?.value)) {
      memoryAccounts = data.value as StoredAdminAccount[];
      return memoryAccounts;
    }
  } catch {}
  return memoryAccounts;
}

async function saveAdminAccounts(accounts: StoredAdminAccount[]): Promise<void> {
  memoryAccounts = accounts;
  try {
    const db = getAdminClient();
    await db
      .from('site_config')
      .upsert([{ key: ADMIN_ACCOUNTS_KEY, value: accounts, updated_at: new Date().toISOString() }]);
  } catch (err) {
    console.warn('Admin account persistence fallback:', err);
  }
}

function isSecureRequest(req?: NextRequest): boolean {
  if (!req) return false;
  const proto = req.headers.get('x-forwarded-proto') || req.nextUrl.protocol.replace(':', '');
  return proto === 'https';
}

function attachSessionCookie(res: NextResponse, token: string, req: NextRequest) {
  res.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: isSecureRequest(req),
    sameSite: 'lax',
    path: '/',
    maxAge: 86400,
  });
}

/**
 * GET /api/admin/auth
 * Reports whether the request is authenticated and whether admin accounts exist.
 * Never exposes secrets, password hashes, or unregistered emails.
 */
export async function GET(req: NextRequest) {
  try {
    const cookieToken = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const authHeader = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    const token = cookieToken || authHeader;

    const [session, accounts] = await Promise.all([
      extractAdminSession(token),
      loadAdminAccounts(),
    ]);

    return NextResponse.json({
      ok: session.valid,
      authenticated: session.valid,
      hasAccounts: accounts.length > 0,
      adminEmail: session.valid ? session.email || null : null,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, authenticated: false, hasAccounts: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/auth
 * mode === 'register': validates email + password + server secretKey to create a real admin account.
 * mode === 'login': validates registered admin email + password on all subsequent sign-ins.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const mode = String(body.mode || 'login').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const secretKey = String(body.secretKey || body.key || '').trim();
    const name = String(body.name || '').trim().slice(0, 60);

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

    if (mode === 'register') {
      if (!emailOk) {
        return NextResponse.json(
          { ok: false, message: 'Enter a valid administrator email address.' },
          { status: 400 }
        );
      }
      if (password.length < 8) {
        return NextResponse.json(
          { ok: false, message: 'Password must be at least 8 characters long.' },
          { status: 400 }
        );
      }
      if (!secretKey || !verifyAdminPassword(secretKey)) {
        return NextResponse.json(
          { ok: false, message: 'Invalid admin secret key. Account creation denied.' },
          { status: 401 }
        );
      }

      const accounts = await loadAdminAccounts();
      if (accounts.some((a) => a.email === email)) {
        return NextResponse.json(
          { ok: false, message: 'An admin account with this email already exists. Please sign in.' },
          { status: 409 }
        );
      }

      const { salt, hash } = await hashAdminPassword(password);
      const newAcct: StoredAdminAccount = {
        id: `adm-${Date.now().toString(36)}`,
        email,
        name: name || email.split('@')[0],
        salt,
        hash,
        createdAt: new Date().toISOString(),
      };

      const updated = [...accounts, newAcct];
      await saveAdminAccounts(updated);

      try {
        const db = getAdminClient();
        await db.from('audit_log').insert([
          { action: `Registered admin account: ${email}`, details: { email } },
        ]);
      } catch {}

      const token = await createAdminSessionToken(86400, email);
      const res = NextResponse.json({
        ok: true,
        authenticated: true,
        hasAccounts: true,
        adminEmail: email,
        message: 'Admin account created and signed in.',
        token,
      });
      attachSessionCookie(res, token, req);
      return res;
    }

    // Standard login (email + password)
    const accounts = await loadAdminAccounts();
    if (accounts.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          hasAccounts: false,
          message: 'No admin account exists yet. Create your admin account using your secret key first.',
        },
        { status: 400 }
      );
    }

    if (!emailOk || !password) {
      return NextResponse.json(
        { ok: false, message: 'Admin email and password are required.' },
        { status: 400 }
      );
    }

    const account = accounts.find((a) => a.email === email);
    const validPassword = account
      ? await verifyAdminPasswordHash(password, account.salt, account.hash)
      : false;

    if (!account || !validPassword) {
      return NextResponse.json(
        { ok: false, message: 'Invalid admin email or password.' },
        { status: 401 }
      );
    }

    try {
      const db = getAdminClient();
      await db.from('audit_log').insert([
        { action: `Admin signed in: ${account.email}`, details: { email: account.email } },
      ]);
    } catch {}

    const token = await createAdminSessionToken(86400, account.email);
    const res = NextResponse.json({
      ok: true,
      authenticated: true,
      hasAccounts: true,
      adminEmail: account.email,
      message: 'Authentication successful.',
      token,
    });
    attachSessionCookie(res, token, req);
    return res;
  } catch {
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
export async function DELETE(req: NextRequest) {
  const response = NextResponse.json({
    ok: true,
    message: 'Signed out successfully.',
  });

  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: isSecureRequest(req),
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
