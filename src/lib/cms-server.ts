// ==============================================================================
// MWALIMU FAMILY - SERVER CMS STORAGE (Supabase site_config + in-memory cache)
// ==============================================================================

import { getAdminClient } from './supabase';
import { CmsData, DEFAULT_CMS_DATA, mergeCmsData } from './cms';

const CMS_KEYS = {
  siteCopy: 'cms_site_copy',
  news: 'cms_news',
  courses: 'cms_courses',
  learning: 'cms_learning',
  teaching: 'cms_teaching',
  games: 'cms_games',
} as const;

export type CmsSliceKey = keyof typeof CMS_KEYS;

// Process-level cache mirrors saved data immediately even if Supabase is offline
const memoryStore: Partial<CmsData> = {};

export async function loadCmsServer(): Promise<CmsData> {
  try {
    const admin = getAdminClient();
    const { data, error } = await admin
      .from('site_config')
      .select('key, value, updated_at')
      .in('key', Object.values(CMS_KEYS));

    if (!error && Array.isArray(data)) {
      const dbPartial: Partial<CmsData> = {};
      let latestIso = '';

      for (const row of data) {
        if (row.updated_at && row.updated_at > latestIso) latestIso = row.updated_at;
        if (row.key === CMS_KEYS.siteCopy && row.value) dbPartial.siteCopy = row.value;
        if (row.key === CMS_KEYS.news && row.value) dbPartial.news = row.value;
        if (row.key === CMS_KEYS.courses && row.value) dbPartial.courses = row.value;
        if (row.key === CMS_KEYS.learning && row.value) dbPartial.learning = row.value;
        if (row.key === CMS_KEYS.teaching && row.value) dbPartial.teaching = row.value;
        if (row.key === CMS_KEYS.games && row.value) dbPartial.games = row.value;
      }

      return mergeCmsData({
        ...memoryStore,
        ...dbPartial,
        updatedAt: latestIso || memoryStore.updatedAt || new Date().toISOString(),
      });
    }
  } catch (err) {
    console.warn('CMS server read fallback:', err);
  }

  return mergeCmsData(memoryStore);
}

export async function saveCmsSliceServer(
  section: CmsSliceKey | 'all',
  payload: any
): Promise<{ cms: CmsData; storedIn: 'supabase' | 'memory' }> {
  const admin = getAdminClient();
  const now = new Date().toISOString();

  const keysToWrite: CmsSliceKey[] =
    section === 'all'
      ? ['siteCopy', 'news', 'courses', 'learning', 'teaching', 'games']
      : [section];

  const rows: { key: string; value: any; updated_at: string }[] = [];

  for (const slice of keysToWrite) {
    const val = section === 'all' ? payload?.[slice] : payload;
    if (val === undefined) continue;
    (memoryStore as any)[slice] = val;
    rows.push({
      key: CMS_KEYS[slice],
      value: val,
      updated_at: now,
    });
  }
  memoryStore.updatedAt = now;

  let storedIn: 'supabase' | 'memory' = 'memory';
  if (rows.length > 0) {
    try {
      const { error } = await admin.from('site_config').upsert(rows);
      if (!error) storedIn = 'supabase';
    } catch (err) {
      console.warn('CMS server write fallback:', err);
    }

    try {
      await admin.from('audit_log').insert([
        {
          action: `Updated CMS section: ${section}`,
          details: { section, slices: keysToWrite },
        },
      ]);
    } catch {}
  }

  const cms = await loadCmsServer();
  return { cms, storedIn };
}

export { DEFAULT_CMS_DATA };
