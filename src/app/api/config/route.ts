import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getAdminClient, SEED_CONFIG, SEED_CHECKS } from '@/lib/supabase';
import { verifyRequestAdmin } from '@/lib/auth';
import { DEFAULT_AI_SETTINGS, loadAiSettingsServer, saveAiSettingsServer } from '@/lib/ai-config-server';
import {
  DEFAULT_LEADERBOARD_SETTINGS,
  DEFAULT_PRICING_SETTINGS,
  loadLeaderboardSettingsServer,
  loadPricingSettingsServer,
  saveLeaderboardSettingsServer,
  savePricingSettingsServer,
} from '@/lib/site-controls-server';

export async function GET() {
  try {
    const admin = getAdminClient();
    const [configRes, checksRes, aiState, pricingSettings, leaderboardSettings] = await Promise.all([
      admin.from('site_config').select('*'),
      admin.from('verification_checks').select('*'),
      loadAiSettingsServer(),
      loadPricingSettingsServer(),
      loadLeaderboardSettingsServer(),
    ]);

    const configData = configRes.data || [];
    const checksData = checksRes.data || [];

    const flagsRow = configData.find((c: any) => c.key === 'flags');
    const bannerRow = configData.find((c: any) => c.key === 'banner');

    const flags = flagsRow?.value || SEED_CONFIG.flags;
    const banner = bannerRow?.value || SEED_CONFIG.banner;
    const checks = checksData.length > 0 ? checksData : SEED_CHECKS;

    return NextResponse.json(
      {
        ok: true,
        flags,
        banner,
        checks,
        aiSettings: aiState.aiSettings,
        pricingSettings,
        leaderboardSettings,
      },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (err: any) {
    console.error('Config GET error:', err);
    return NextResponse.json({
      ok: true,
      flags: SEED_CONFIG.flags,
      banner: SEED_CONFIG.banner,
      checks: SEED_CHECKS,
      aiSettings: DEFAULT_AI_SETTINGS,
      pricingSettings: DEFAULT_PRICING_SETTINGS,
      leaderboardSettings: DEFAULT_LEADERBOARD_SETTINGS,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await verifyRequestAdmin(req))) {
      return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
    }
    const body = await req.json();
    const { flags, banner, checkAction, aiSettings, pricingSettings, leaderboardSettings } = body;

    const admin = getAdminClient();

    if (flags) {
      await admin
        .from('site_config')
        .upsert([{ key: 'flags', value: flags, updated_at: new Date().toISOString() }]);
      SEED_CONFIG.flags = flags;
      if (typeof flags.ai === 'boolean') {
        await saveAiSettingsServer({ assistantEnabled: flags.ai });
      }
    }

    if (banner) {
      await admin
        .from('site_config')
        .upsert([{ key: 'banner', value: banner, updated_at: new Date().toISOString() }]);
      SEED_CONFIG.banner = banner;
    }

    if (aiSettings && typeof aiSettings === 'object') {
      const savedAi = await saveAiSettingsServer(aiSettings);
      if (typeof aiSettings.assistantEnabled === 'boolean') {
        const nextFlags = { ...SEED_CONFIG.flags, ...(flags || {}), ai: savedAi.assistantEnabled };
        await admin
          .from('site_config')
          .upsert([{ key: 'flags', value: nextFlags, updated_at: new Date().toISOString() }]);
        SEED_CONFIG.flags = nextFlags;
      }
    }

    if (pricingSettings && typeof pricingSettings === 'object') {
      await savePricingSettingsServer(pricingSettings);
    }

    if (leaderboardSettings && typeof leaderboardSettings === 'object') {
      await saveLeaderboardSettingsServer(leaderboardSettings);
    }

    if (checkAction === 'verify_all') {
      const today = new Date().toISOString().slice(0, 10);
      await admin
        .from('verification_checks')
        .update({ last_verified: today, status: 'verified' })
        .neq('id', 0);

      SEED_CHECKS.forEach((c) => (c.last = today));
    }

    try {
      await admin.from('audit_log').insert([
        {
          action: pricingSettings
            ? 'Updated Pricing plans and M-Pesa settings'
            : leaderboardSettings
            ? 'Updated Leaderboard rules and visibility'
            : aiSettings
            ? 'Updated AI Tutor & Assistant controls'
            : checkAction === 'verify_all'
            ? 'Marked all editorial accuracy checks verified'
            : 'Updated site configuration flags and banners',
          details: { flags, banner, aiSettings, pricingSettings, leaderboardSettings, checkAction },
        },
      ]);
    } catch {}

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Config POST error:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
