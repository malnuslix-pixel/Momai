'use client';

import { useState, useEffect } from 'react';

export type Language = 'en' | 'sw';

const LANG_STORAGE_KEY = 'mf_lang';

export function getStoredLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === 'sw' || saved === 'en') return saved;
  } catch {}
  return 'en';
}

export function setStoredLanguage(lang: Language): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    window.dispatchEvent(new CustomEvent('mwalimu-lang-change', { detail: { lang } }));
  } catch {}
}

export function useLanguage(): [Language, (next: Language) => void] {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    // 1. Initial read
    const initial = getStoredLanguage();
    setLang(initial);
    document.documentElement.lang = initial;

    // 2. Custom event listener for instant reactivity across components
    const handleEvent = (e: any) => {
      const next = e.detail?.lang;
      if (next === 'sw' || next === 'en') {
        setLang(next);
      }
    };

    window.addEventListener('mwalimu-lang-change', handleEvent);
    return () => window.removeEventListener('mwalimu-lang-change', handleEvent);
  }, []);

  const changeLang = (next: Language) => {
    setLang(next);
    setStoredLanguage(next);
  };

  return [lang, changeLang];
}
