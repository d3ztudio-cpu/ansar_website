import React, { useState } from 'react';
import { generateEventReport } from './reportUtils';

/**
 * Reusable "Download Report" button.
 *
 * Two usage modes:
 *  1. <ReportButton item={reportItem} logo={dataUrl} />            → generates here
 *  2. <ReportButton item={reportItem} onGenerate={async (onProgress) => {...}} /> → card supplies its own generator
 *
 * Shows an inline progress label while the PDF is being built.
 */
export default function ReportButton({ item, logo, onGenerate, kindLabel = 'Event', className = '', label = 'Download Report' }) {
  const [state, setState] = useState({ busy: false, pct: 0, label: '' });
  const [error, setError] = useState(null);

  const handleClick = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (state.busy) return;
    setError(null);
    setState({ busy: true, pct: 5, label: 'Preparing…' });
    try {
      if (onGenerate) {
        await onGenerate((pct, progressLabel) => setState({ busy: true, pct, label: progressLabel }));
      } else {
        await generateEventReport(item, logo, {
          onProgress: (pct, progressLabel) => setState({ busy: true, pct, label: progressLabel })
        });
      }
      setState({ busy: false, pct: 0, label: '' });
    } catch (err) {
      console.error('Report generation failed:', err);
      setError('Could not generate the report. Please try again.');
      setState({ busy: false, pct: 0, label: '' });
    }
  };

  if (state.busy) {
    return (
      <button
        type="button"
        disabled
        className={`inline-flex items-center justify-center gap-2 rounded-lg font-bold transition-all cursor-wait opacity-90 ${className}`}
      >
        <svg className="h-4 w-4 flex-shrink-0 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <span className="truncate">{state.label || 'Generating…'}{state.pct && state.pct < 100 ? ` ${state.pct}%` : ''}</span>
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center justify-center gap-2 rounded-lg font-bold transition-all ${className}`}
        title={`Download a PDF report about this ${kindLabel.toLowerCase()}`}
        aria-label={`Download PDF report about ${item?.title || kindLabel}`}
      >
        <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2-8l2.586 2.586a2 2 0 01.586 1.414V19a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h6l2.586 2.586z" />
        </svg>
        {label}
      </button>
      {error && <p className="text-xs text-red-600 mt-1 text-center">{error}</p>}
    </>
  );
}
