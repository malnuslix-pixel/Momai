import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { supabase, getAdminClient, SEED_ITEMS } from '@/lib/supabase';
import { FeedItem } from '@/lib/types';
import { verifyRequestAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const requestedAll = searchParams.get('all') === 'true';
    const filterKind = searchParams.get('k');
    
    // Only verified administrators can request drafts and rejected items
    const isAdmin = requestedAll ? await verifyRequestAdmin(req) : false;
    const all = requestedAll && isAdmin;

    const admin = getAdminClient();
    let query = admin.from('items').select('*').order('created_at', { ascending: false });

    if (!all) {
      query = query.eq('st', 'published');
    }
    if (filterKind === 'job' || filterKind === 'notice') {
      query = query.eq('k', filterKind);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      let items = all ? SEED_ITEMS : SEED_ITEMS.filter((i) => i.st === 'published');
      if (filterKind === 'job' || filterKind === 'notice') {
        items = items.filter((i) => i.k === filterKind);
      }
      return NextResponse.json({
        ok: true,
        items,
        updated: new Date().toISOString().slice(0, 10),
      });
    }

    return NextResponse.json({
      ok: true,
      items: data,
      updated: new Date().toISOString().slice(0, 10),
    });
  } catch (err: any) {
    console.error('Items GET error:', err);
    return NextResponse.json({ ok: true, items: SEED_ITEMS });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await verifyRequestAdmin(req))) {
      return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
    }
    const body = await req.json();
    const item: Partial<FeedItem> = {
      k: body.k === 'job' ? 'job' : 'notice',
      t: String(body.t || '').trim(),
      who: String(body.who || '').trim(),
      loc: String(body.loc || '').trim(),
      cat: String(body.cat || '').trim(),
      body: String(body.body || '').trim(),
      st: body.st || 'draft',
      exp: body.exp || null,
      featured: Boolean(body.featured),
    };

    if (!item.t || !item.body) {
      return NextResponse.json({ error: 'Title and body are required' }, { status: 400 });
    }

    const admin = getAdminClient();
    const { data, error } = await admin.from('items').insert([item]).select().single();

    if (error) {
      console.warn('Item insert warning:', error.message);
      const fallbackItem = { ...item, id: Date.now() };
      SEED_ITEMS.unshift(fallbackItem as FeedItem);
      return NextResponse.json({ ok: true, item: fallbackItem });
    }

    // Audit log
    try {
      await admin.from('audit_log').insert([
        { action: `Created ${item.k}: ${item.t}`, details: item },
      ]);
    } catch {}

    return NextResponse.json({ ok: true, item: data });
  } catch (err: any) {
    console.error('Items POST error:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    if (!(await verifyRequestAdmin(req))) {
      return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
    }
    const body = await req.json();
    const { id, st, exp } = body;

    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 });
    }

    const admin = getAdminClient();
    const updates: Record<string, any> = {};
    if (st) updates.st = st;
    if (exp !== undefined) updates.exp = exp;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await admin
      .from('items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      // In-memory fallback
      const idx = SEED_ITEMS.findIndex((i) => String(i.id) === String(id));
      if (idx !== -1) {
        if (st) SEED_ITEMS[idx].st = st;
        if (exp !== undefined) SEED_ITEMS[idx].exp = exp;
      }
      return NextResponse.json({ ok: true });
    }

    // Audit log
    try {
      await admin.from('audit_log').insert([
        { action: `Updated item #${id} status: ${st}`, details: { id, st, exp } },
      ]);
    } catch {}

    return NextResponse.json({ ok: true, item: data });
  } catch (err: any) {
    console.error('Items PATCH error:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!(await verifyRequestAdmin(req))) {
      return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 });
    }

    const admin = getAdminClient();
    const { error } = await admin.from('items').delete().eq('id', id);

    if (error) {
      const idx = SEED_ITEMS.findIndex((i) => String(i.id) === String(id));
      if (idx !== -1) SEED_ITEMS.splice(idx, 1);
    }

    // Audit log
    try {
      await admin.from('audit_log').insert([
        { action: `Deleted item #${id}` },
      ]);
    } catch {}

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Items DELETE error:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
