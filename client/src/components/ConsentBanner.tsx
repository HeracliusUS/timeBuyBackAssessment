/**
 * Lightweight, non-blocking consent banner (US-default GRANTED / opt-out).
 * Mirrors the marketing site's banner. Consent Mode v2 defaults are set GRANTED
 * in index.html; this lets visitors opt out. See MEASUREMENT-PLAN.md §9.
 */
import { useEffect, useState } from 'react';
import { getStoredConsent, updateConsent, clarityConsent } from '@/lib/analytics';

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getStoredConsent() === null);
  }, []);

  if (!visible) return null;

  const choose = (granted: boolean) => {
    updateConsent(granted);
    clarityConsent(granted);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Privacy and cookies"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-white/95 px-4 py-3 shadow-lg backdrop-blur sm:px-6"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted-foreground">
          We use cookies and analytics (Google Analytics, Microsoft Clarity) to understand how this
          assessment is used and improve it. See our{' '}
          <a
            href="https://justaskava.ai/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-blue underline underline-offset-2"
          >
            Privacy Policy
          </a>
          .
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => choose(false)}
            className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary/50"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => choose(true)}
            className="rounded-full bg-brand-green px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-green-light"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
