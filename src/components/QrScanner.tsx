'use client';

import React, { useEffect, useState } from 'react';

const REGION_ID = 'guard-qr-region';

// Opens the back camera and reports the first QR code it reads. Needs HTTPS or localhost.
export const QrScanner: React.FC<{ onScan: (text: string) => void }> = ({ onScan }) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let scanner: import('html5-qrcode').Html5Qrcode | undefined;
    let done = false;
    // Loaded on demand: the library touches `window`, which doesn't exist during static export.
    import('html5-qrcode').then(({ Html5Qrcode }) => {
      if (done) return;
      scanner = new Html5Qrcode(REGION_ID);
      scanner
        .start({ facingMode: 'environment' }, { fps: 10, qrbox: 220 }, (text) => {
          if (done) return;
          done = true;
          onScan(text.trim());
        }, undefined)
        .catch((e) => setError(String(e?.message ?? e)));
    });
    return () => {
      done = true;
      scanner?.stop().catch(() => {}).finally(() => scanner?.clear());
    };
  }, [onScan]);

  return (
    <div className="space-y-2">
      <div id={REGION_ID} className="w-full overflow-hidden rounded-lg border border-white/10 bg-black" />
      {error && (
        <p role="alert" className="text-xs font-mono text-rose-400">
          Camera unavailable: {error}. Type the pass code instead.
        </p>
      )}
    </div>
  );
};
