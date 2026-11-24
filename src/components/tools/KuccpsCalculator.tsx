'use client';

import React, { useState } from 'react';
import { Calculator, Copy, Check, Info, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function KuccpsCalculator() {
  const [cluster4, setCluster4] = useState<number>(36);
  const [total7, setTotal7] = useState<number>(60);
  const [copied, setCopied] = useState(false);

  // Validate bounds
  const isValid4 = cluster4 >= 4 && cluster4 <= 48;
  const isValid7 = total7 >= 7 && total7 <= 84;
  const isValid = isValid4 && isValid7 && cluster4 <= total7;

  // Formula: sqrt((r / 48) * (t / 84)) * 48
  const clusterPoints = isValid
    ? Math.sqrt((cluster4 / 48) * (total7 / 84)) * 48
    : null;

  let guidance = '';
  if (clusterPoints !== null) {
    if (clusterPoints >= 40) {
      guidance = 'Highly competitive for Tier 1 STEM & Clinical disciplines (Medicine, Civil/Electrical Engineering, Architecture, Pharmacy).';
    } else if (clusterPoints >= 33) {
      guidance = 'Strong candidate for Computer Science, Law, Commerce, Nursing, Actuarial Science, and Information Technology.';
    } else if (clusterPoints >= 25) {
      guidance = 'Eligible for Bachelor of Education (Science/Arts), Agribusiness, Environmental Studies, and Business Management.';
    } else {
      guidance = 'Eligible for KUCCPS State-Sponsored Diplomas and TVET technical institute pathways.';
    }
  }

  const handleCopy = () => {
    if (!clusterPoints) return;
    const text = `KUCCPS Cluster Calculation:\nPrerequisite 4 Subjects: ${cluster4}/48 Points\nKCSE Overall (7 Subjects): ${total7}/84 Points\nEstimated Weighted Cluster Points: ${clusterPoints.toFixed(3)} / 48.000\nPlacement Insight: ${guidance}\nCalculated at: https://mwalimufamily.co.ke/tools`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card tool-modular-card">
      <div className="tool-header">
        <div className="tool-title-wrap">
          <span className="tool-icon-pill">
            <Calculator size={18} />
          </span>
          <div>
            <h3>KUCCPS Weighted Cluster Points Calculator</h3>
            <p>Official Placement Authority formula: $\sqrt&#123;(r/48) \times (t/84)&#125; \times 48$.</p>
          </div>
        </div>
        <span className="tool-badge-accent">KUCCPS Formula</span>
      </div>

      <div className="tool-body">
        <div className="tool-grid-inputs" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <div className="tool-input-row">
            <label htmlFor="cluster4-input">
              4 Cluster Prerequisite Subjects (r)
              <span className="input-hint">Min 4 &bull; Max 48</span>
            </label>
            <input
              id="cluster4-input"
              type="number"
              min={4}
              max={48}
              value={cluster4}
              onChange={(e) => setCluster4(Number(e.target.value))}
            />
          </div>

          <div className="tool-input-row">
            <label htmlFor="total7-input">
              KCSE 7-Subject Overall Aggregate (t)
              <span className="input-hint">Min 7 &bull; Max 84</span>
            </label>
            <input
              id="total7-input"
              type="number"
              min={7}
              max={84}
              value={total7}
              onChange={(e) => setTotal7(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Calculation Result */}
        {isValid && clusterPoints !== null ? (
          <div className="tool-result-panel">
            <div className="result-metric-col">
              <span className="result-label">Weighted Cluster Score</span>
              <div className="result-score">
                {clusterPoints.toFixed(3)}{' '}
                <span className="result-max">/ 48.000</span>
              </div>
            </div>

            <div className="result-info-col" style={{ flex: 2 }}>
              <div className="result-desc" style={{ fontSize: '0.94rem' }}>{guidance}</div>
              <div className="status-pill status-pass" style={{ alignSelf: 'flex-start' }}>
                <Info size={14} />
                <span>Formula verified against official KUCCPS gazetted criteria</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="tool-error-banner">
            Please enter valid scores: Cluster subjects (4–48) cannot exceed overall aggregate (7–84).
          </div>
        )}

        <div className="tool-footer-actions">
          <button
            type="button"
            className="btn-action-copy"
            onClick={handleCopy}
            disabled={!isValid}
            aria-label="Copy cluster calculation to clipboard"
          >
            {copied ? <Check size={16} className="text-green" /> : <Copy size={16} />}
            <span>{copied ? 'Score Copied!' : 'Copy Cluster Slip'}</span>
          </button>
          <Link href="/courses" className="tool-sub-link">
            Compare with university degree requirements <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
