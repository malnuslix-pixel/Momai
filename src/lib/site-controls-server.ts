import { getAdminClient } from './supabase';
import type { LeaderboardSettings, PricingPlanConfig, PricingSettings } from './types';
import {
  DEFAULT_LEADERBOARD_SETTINGS,
  DEFAULT_PRICING_PLANS,
  DEFAULT_PRICING_SETTINGS,
} from './site-controls';

export { DEFAULT_LEADERBOARD_SETTINGS, DEFAULT_PRICING_PLANS, DEFAULT_PRICING_SETTINGS };

let memoryPricingSettings: PricingSettings = structuredClone(DEFAULT_PRICING_SETTINGS);
let memoryLeaderboardSettings: LeaderboardSettings = structuredClone(DEFAULT_LEADERBOARD_SETTINGS);

function sanitizePlans(raw: unknown): PricingPlanConfig[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    return structuredClone(DEFAULT_PRICING_PLANS);
  }
  const byId = new Map<string, any>();
  for (const item of raw) {
    if (item && typeof item === 'object' && typeof item.id === 'string') {
      byId.set(item.id, item);
    }
  }
  return DEFAULT_PRICING_PLANS.map((def) => {
    const incoming = byId.get(def.id);
    if (!incoming) return { ...def, features: [...def.features] };
    const priceNum = Number(incoming.price);
    const features = Array.isArray(incoming.features)
      ? incoming.features.map((f: unknown) => String(f || '').trim()).filter(Boolean)
      : [...def.features];
    return {
      id: def.id,
      name: String(incoming.name ?? def.name).trim() || def.name,
      subtitle: String(incoming.subtitle ?? def.subtitle).trim(),
      price: Number.isFinite(priceNum) && priceNum >= 0 ? Math.round(priceNum) : def.price,
      period: String(incoming.period ?? def.period).trim(),
      popular: typeof incoming.popular === 'boolean' ? incoming.popular : Boolean(def.popular),
      cta: String(incoming.cta ?? def.cta).trim() || def.cta,
      disabled: def.id === 'free' ? true : Boolean(incoming.disabled ?? def.disabled),
      enabled: typeof incoming.enabled === 'boolean' ? incoming.enabled : true,
      features: features.length > 0 ? features : [...def.features],
    };
  });
}

export function normalizePricingSettings(raw?: Partial<PricingSettings> | null): PricingSettings {
  const s = raw || {};
  return {
    pricingEnabled: typeof s.pricingEnabled === 'boolean' ? s.pricingEnabled : DEFAULT_PRICING_SETTINGS.pricingEnabled,
    mpesaEnabled: typeof s.mpesaEnabled === 'boolean' ? s.mpesaEnabled : DEFAULT_PRICING_SETTINGS.mpesaEnabled,
    heroTitle: String(s.heroTitle ?? DEFAULT_PRICING_SETTINGS.heroTitle).trim() || DEFAULT_PRICING_SETTINGS.heroTitle,
    heroSubtitle: String(s.heroSubtitle ?? DEFAULT_PRICING_SETTINGS.heroSubtitle).trim() || DEFAULT_PRICING_SETTINGS.heroSubtitle,
    pausedMessage: String(s.pausedMessage ?? DEFAULT_PRICING_SETTINGS.pausedMessage).trim() || DEFAULT_PRICING_SETTINGS.pausedMessage,
    plans: sanitizePlans(s.plans),
  };
}

export function normalizeLeaderboardSettings(raw?: Partial<LeaderboardSettings> | null): LeaderboardSettings {
  const s = raw || {};
  const maxEntriesNum = Number(s.maxEntries);
  const period = s.defaultPeriod === 'monthly' || s.defaultPeriod === 'alltime' ? s.defaultPeriod : 'weekly';
  return {
    leaderboardEnabled: typeof s.leaderboardEnabled === 'boolean' ? s.leaderboardEnabled : DEFAULT_LEADERBOARD_SETTINGS.leaderboardEnabled,
    showBadgesTab: typeof s.showBadgesTab === 'boolean' ? s.showBadgesTab : DEFAULT_LEADERBOARD_SETTINGS.showBadgesTab,
    defaultPeriod: period,
    maxEntries: Number.isFinite(maxEntriesNum) && maxEntriesNum >= 5 ? Math.min(100, Math.round(maxEntriesNum)) : DEFAULT_LEADERBOARD_SETTINGS.maxEntries,
    showSampleLeaders: typeof s.showSampleLeaders === 'boolean' ? s.showSampleLeaders : DEFAULT_LEADERBOARD_SETTINGS.showSampleLeaders,
    heroTitle: String(s.heroTitle ?? DEFAULT_LEADERBOARD_SETTINGS.heroTitle).trim() || DEFAULT_LEADERBOARD_SETTINGS.heroTitle,
    heroSubtitle: String(s.heroSubtitle ?? DEFAULT_LEADERBOARD_SETTINGS.heroSubtitle).trim() || DEFAULT_LEADERBOARD_SETTINGS.heroSubtitle,
    pausedMessage: String(s.pausedMessage ?? DEFAULT_LEADERBOARD_SETTINGS.pausedMessage).trim() || DEFAULT_LEADERBOARD_SETTINGS.pausedMessage,
  };
}

export async function loadPricingSettingsServer(): Promise<PricingSettings> {
  try {
    const db = getAdminClient();
    const { data } = await db.from('site_config').select('value').eq('key', 'pricing_settings').single();
    if (data?.value && typeof data.value === 'object') {
      const normalized = normalizePricingSettings(data.value as Partial<PricingSettings>);
      memoryPricingSettings = normalized;
      return normalized;
    }
  } catch {}
  return memoryPricingSettings;
}

export async function savePricingSettingsServer(partial: Partial<PricingSettings>): Promise<PricingSettings> {
  const current = await loadPricingSettingsServer();
  const next = normalizePricingSettings({ ...current, ...partial });
  memoryPricingSettings = next;
  try {
    const db = getAdminClient();
    await db.from('site_config').upsert([
      { key: 'pricing_settings', value: next, updated_at: new Date().toISOString() },
    ]);
  } catch {}
  return next;
}

export async function loadLeaderboardSettingsServer(): Promise<LeaderboardSettings> {
  try {
    const db = getAdminClient();
    const { data } = await db.from('site_config').select('value').eq('key', 'leaderboard_settings').single();
    if (data?.value && typeof data.value === 'object') {
      const normalized = normalizeLeaderboardSettings(data.value as Partial<LeaderboardSettings>);
      memoryLeaderboardSettings = normalized;
      return normalized;
    }
  } catch {}
  return memoryLeaderboardSettings;
}

export async function saveLeaderboardSettingsServer(partial: Partial<LeaderboardSettings>): Promise<LeaderboardSettings> {
  const current = await loadLeaderboardSettingsServer();
  const next = normalizeLeaderboardSettings({ ...current, ...partial });
  memoryLeaderboardSettings = next;
  try {
    const db = getAdminClient();
    await db.from('site_config').upsert([
      { key: 'leaderboard_settings', value: next, updated_at: new Date().toISOString() },
    ]);
  } catch {}
  return next;
}
