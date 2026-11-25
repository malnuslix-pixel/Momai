import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        supabase: isSupabaseConfigured,
        adminAuth: Boolean(process.env.ADMIN_SECRET_KEY),
      },
    },
    { status: 200 }
  );
}
