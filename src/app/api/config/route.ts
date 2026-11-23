import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { supabase, getAdminClient, SEED_CONFIG, SEED_CHECKS } from '@/lib/supabase';

export async function GET() {
  try {
    const admin = getAdminClient();
    const { data: configData } = await admin.from('site_config').select('*');
    const { data: checksData } = await admin.from('verification_checks').select('*');

    const flagsRow = configData?.find((c: any) => c.key === 'flags');
    const bannerRow = configData?.find((c: any) => c.key === 'banner');

    const flags = flagsRow?.value || SEED_CONFIG.flags;
    const banner = bannerRow?.value || SEED_CONFIG.banner;
    const checks = checksData && checksData.length > 0 ? checksData : SEED_CHECKS;

    return NextResponse.json({
      ok: true,
      flags,
      banner,
      checks,
    });
  } catch (err: any) {
    console.error('Config GET error:', err);
    return NextResponse.json({
      ok: true,
      flags: SEED_CONFIG.flags,
      banner: SEED_CONFIG.banner,
      checks: SEED_CHECKS,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { flags, banner, checkAction } = body;

    const admin = getAdminClient();

    if (flags) {
      await admin
        .from('site_config')
        .upsert([{ key: 'flags', value: flags, updated_at: new Date().toISOString() }]);
      SEED_CONFIG.flags = flags;
    }

    if (banner) {
      await admin
        .from('site_config')
        .upsert([{ key: 'banner', value: banner, updated_at: new Date().toISOString() }]);
      SEED_CONFIG.banner = banner;
    }

    if (checkAction === 'verify_all') {
      const today = new Date().toISOString().slice(0, 10);
      await admin
        .from('verification_checks')
        .update({ last_verified: today, status: 'verified' })
        .neq('id', 0);

      SEED_CHECKS.forEach((c) => (c.last = today));
    }

    // Audit log
    try {
      await admin.from('audit_log').insert([
        {
          action: 'Updated site configuration flags and banners',
          details: { flags, banner, checkAction },
        },
      ]);
    } catch {}

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Config POST error:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
