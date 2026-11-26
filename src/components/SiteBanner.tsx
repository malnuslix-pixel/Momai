'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, X } from 'lucide-react';

export default function SiteBanner() {
  const [bannerText, setBannerText] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem('mf_banner_dismissed') === '1') {
        setDismissed(true);
        return;
      }
    } catch {}

    fetch('/api/config')
      .then((r) => r.json())
      .then((data) => {
        if (data?.ok && data.flags?.scam !== false && data.banner?.active && data.banner?.text) {
          setBannerText(String(data.banner.text));
        }
      })
      .catch(() => {});
  }, []);

  if (dismissed || !bannerText) return null;

  return (
    <div className="site-alert-banner" role="region" aria-label="Official advisory banner">
      <div className="w site-alert-inner">
        <div className="site-alert-text">
          <AlertTriangle size={16} className="site-alert-icon" aria-hidden="true" />
          <span>{bannerText}</span>
          <Link href="/news/s4" className="site-alert-link">
            Safety Guide →
          </Link>
        </div>
        <button
          type="button"
          className="site-alert-close"
          onClick={() => {
            setDismissed(true);
            try {
              sessionStorage.setItem('mf_banner_dismissed', '1');
            } catch {}
          }}
          aria-label="Dismiss official notice banner"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
