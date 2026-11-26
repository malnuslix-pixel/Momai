import { NextRequest, NextResponse } from 'next/server';
import { verifyRequestAdmin } from '@/lib/auth';
import { loadCmsServer, saveCmsSliceServer, CmsSliceKey } from '@/lib/cms-server';

export const dynamic = 'force-dynamic';

const VALID_SECTIONS = new Set<string>([
  'siteCopy',
  'news',
  'courses',
  'learning',
  'teaching',
  'games',
  'all',
]);

export async function GET() {
  try {
    const cms = await loadCmsServer();
    return NextResponse.json(
      { ok: true, cms },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (err) {
    console.error('CMS GET error:', err);
    return NextResponse.json({ ok: false, error: 'Failed to load CMS data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await verifyRequestAdmin(req))) {
      return NextResponse.json({ ok: false, error: 'Unauthorized: Admin session required' }, { status: 401 });
    }

    const body = await req.json();
    const section = String(body.section || '').trim();

    if (!VALID_SECTIONS.has(section) || body.data === undefined) {
      return NextResponse.json(
        { ok: false, error: 'Valid section and data payload are required' },
        { status: 400 }
      );
    }

    const { cms, storedIn } = await saveCmsSliceServer(section as CmsSliceKey | 'all', body.data);
    return NextResponse.json({ ok: true, cms, storedIn });
  } catch (err) {
    console.error('CMS POST error:', err);
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}
