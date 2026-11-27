'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { CmsData, CmsSectionKey, DEFAULT_CMS_DATA, mergeCmsData } from './cms';
import { Language } from './language';
import { recordNavPath } from './navigation';

interface CmsContextValue {
  cms: CmsData;
  loaded: boolean;
  refreshCms: () => Promise<void>;
  setCmsLocal: (next: CmsData) => void;
}

const CmsContext = createContext<CmsContextValue>({
  cms: DEFAULT_CMS_DATA,
  loaded: false,
  refreshCms: async () => {},
  setCmsLocal: () => {},
});

export const CMS_UPDATED_EVENT = 'mwalimu-cms-updated';

export function CmsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [cms, setCms] = useState<CmsData>(DEFAULT_CMS_DATA);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (pathname) recordNavPath(pathname);
  }, [pathname]);

  const refreshCms = useCallback(async () => {
    try {
      const res = await fetch('/api/cms', { cache: 'no-store' });
      const data = await res.json();
      if (data?.ok && data.cms) {
        setCms(mergeCmsData(data.cms));
      }
    } catch {
      // Offline or fallback retains DEFAULT_CMS_DATA safely
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    refreshCms();
    const onUpdated = (e: any) => {
      if (e?.detail?.cms) {
        setCms(mergeCmsData(e.detail.cms));
      } else {
        refreshCms();
      }
    };
    window.addEventListener(CMS_UPDATED_EVENT, onUpdated);
    return () => window.removeEventListener(CMS_UPDATED_EVENT, onUpdated);
  }, [refreshCms]);

  return (
    <CmsContext.Provider value={{ cms, loaded, refreshCms, setCmsLocal: setCms }}>
      {children}
    </CmsContext.Provider>
  );
}

export function useCms() {
  return useContext(CmsContext);
}

export function useSectionCopy(key: CmsSectionKey, lang: Language = 'en') {
  const { cms } = useCms();
  const s = cms.siteCopy.sections[key] || DEFAULT_CMS_DATA.siteCopy.sections[key];
  return {
    tag: lang === 'sw' && s.tagSw ? s.tagSw : s.tag || '',
    title: lang === 'sw' && s.titleSw ? s.titleSw : s.title,
    subtitle: lang === 'sw' && s.subtitleSw ? s.subtitleSw : s.subtitle,
  };
}
