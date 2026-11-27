// ==============================================================================
// MWALIMU FAMILY - SERVER AI CONFIGURATION & QUOTA HELPERS
// ==============================================================================

import { getAdminClient } from './supabase';
import { AiSettings } from './types';

export const DEFAULT_AI_SETTINGS: AiSettings = {
  tutorEnabled: true,
  assistantEnabled: true,
  allowFallback: true,
  dailyCap: 3000,
  tutorGuidance: '',
};

let memoryAiSettings: AiSettings = { ...DEFAULT_AI_SETTINGS };

export async function loadAiSettingsServer(): Promise<{
  aiSettings: AiSettings;
  aiFlag: boolean;
}> {
  try {
    const db = getAdminClient();
    const { data, error } = await db
      .from('site_config')
      .select('key, value')
      .in('key', ['ai_settings', 'flags']);

    if (!error && Array.isArray(data)) {
      const settingsRow = data.find((r: any) => r.key === 'ai_settings')?.value;
      const flagsRow = data.find((r: any) => r.key === 'flags')?.value;
      const aiFlag = flagsRow?.ai !== false;

      if (settingsRow && typeof settingsRow === 'object') {
        memoryAiSettings = {
          tutorEnabled: settingsRow.tutorEnabled !== false,
          assistantEnabled: settingsRow.assistantEnabled !== false && aiFlag,
          allowFallback: settingsRow.allowFallback !== false,
          dailyCap: Math.max(10, Number(settingsRow.dailyCap) || DEFAULT_AI_SETTINGS.dailyCap),
          tutorGuidance: String(settingsRow.tutorGuidance || '').slice(0, 1000),
        };
      } else {
        memoryAiSettings = {
          ...memoryAiSettings,
          assistantEnabled: aiFlag,
        };
      }
      return { aiSettings: memoryAiSettings, aiFlag };
    }
  } catch {}

  return { aiSettings: memoryAiSettings, aiFlag: memoryAiSettings.assistantEnabled };
}

export async function saveAiSettingsServer(next: Partial<AiSettings>): Promise<AiSettings> {
  const merged: AiSettings = {
    tutorEnabled: next.tutorEnabled !== undefined ? Boolean(next.tutorEnabled) : memoryAiSettings.tutorEnabled,
    assistantEnabled: next.assistantEnabled !== undefined ? Boolean(next.assistantEnabled) : memoryAiSettings.assistantEnabled,
    allowFallback: next.allowFallback !== undefined ? Boolean(next.allowFallback) : memoryAiSettings.allowFallback,
    dailyCap: Math.max(10, Number(next.dailyCap) || memoryAiSettings.dailyCap),
    tutorGuidance: next.tutorGuidance !== undefined ? String(next.tutorGuidance).slice(0, 1000) : memoryAiSettings.tutorGuidance,
  };
  memoryAiSettings = merged;

  try {
    const db = getAdminClient();
    await db.from('site_config').upsert([
      {
        key: 'ai_settings',
        value: merged,
        updated_at: new Date().toISOString(),
      },
    ]);
  } catch {}

  return merged;
}

export async function countTodayAiTurns(): Promise<number> {
  try {
    const db = getAdminClient();
    const todayStart = new Date().toISOString().slice(0, 10) + 'T00:00:00.000Z';
    const [chatRes, tutorRes] = await Promise.allSettled([
      db.from('assistant_logs').select('id', { count: 'exact', head: true }).gte('created_at', todayStart),
      db.from('tutor_sessions').select('id', { count: 'exact', head: true }).eq('role', 'user').gte('created_at', todayStart),
    ]);
    const chatCount = chatRes.status === 'fulfilled' ? chatRes.value.count || 0 : 0;
    const tutorCount = tutorRes.status === 'fulfilled' ? tutorRes.value.count || 0 : 0;
    return chatCount + tutorCount;
  } catch {
    return 0;
  }
}
