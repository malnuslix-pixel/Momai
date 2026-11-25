// ==============================================================================
// MWALIMU FAMILY - UNIFIED SERVER-SIDE AI ENGINE
// Supports Gemini (primary), Anthropic (secondary), and deterministic fallback.
// ==============================================================================

export interface AIRequestOptions {
  system: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
}

export interface AIResponseResult {
  text: string;
  provider: 'gemini' | 'anthropic' | 'fallback';
  usedFallback: boolean;
}

export async function generateAIResponse(opts: AIRequestOptions): Promise<AIResponseResult> {
  const { system, prompt, temperature = 0.55, maxTokens = 800, jsonMode = false } = opts;

  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const anthropicKey = process.env.ANTHROPIC_API_KEY?.trim();

  if (geminiKey) {
    const geminiModels = ['gemini-3.8-flash', 'gemini-2.5-flash'];
    for (const model of geminiModels) {
      try {
        const generationConfig: Record<string, any> = {
          temperature,
          maxOutputTokens: maxTokens,
        };
        if (jsonMode) {
          generationConfig.responseMimeType = 'application/json';
        }

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: system }] },
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig,
            }),
            signal: AbortSignal.timeout(15000),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
          if (text) {
            return { text, provider: 'gemini', usedFallback: false };
          }
        }
      } catch (err) {
        console.warn(`Gemini AI (${model}) request failed, trying next:`, err);
      }
    }
  }

  if (anthropicKey && anthropicKey.startsWith('sk-ant')) {
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: maxTokens,
          temperature,
          system,
          messages: [{ role: 'user', content: prompt }],
        }),
        signal: AbortSignal.timeout(15000),
      });

      if (res.ok) {
        const data = await res.json();
        const text =
          data.content
            ?.filter((c: any) => c.type === 'text')
            .map((c: any) => c.text)
            .join('\n')
            .trim() || '';
        if (text) {
          return { text, provider: 'anthropic', usedFallback: false };
        }
      }
    } catch (err) {
      console.warn('Anthropic AI request failed, using built-in fallback:', err);
    }
  }

  return { text: '', provider: 'fallback', usedFallback: true };
}

export function extractJSONFromText<T = any>(raw: string): T | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    const match = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i) || trimmed.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (match && match[1]) {
      try {
        return JSON.parse(match[1].trim()) as T;
      } catch {
        return null;
      }
    }
    return null;
  }
}
