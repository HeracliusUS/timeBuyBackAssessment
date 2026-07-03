// ============================================================
// Just Ask AVA — Assessment funnel analytics (GA4 + Microsoft Clarity)
//
// Reports to the SAME GA4 property as the marketing site (justaskava.ai) so the
// site → assessment journey is ONE cross-domain funnel. See MEASUREMENT-PLAN.md.
// Event taxonomy is documented in ANALYTICS.md.
// ============================================================

const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env ?? {};

/** Shared GA4 measurement ID (same as the marketing site). */
export const GA_MEASUREMENT_ID = env.VITE_GA_MEASUREMENT_ID || 'G-1P3RJJ6LKZ';
/** Microsoft Clarity project ID. */
export const CLARITY_PROJECT_ID = env.VITE_CLARITY_PROJECT_ID || 'widbz9cmzl';

type Primitive = string | number | boolean | undefined | null;
type Params = Record<string, Primitive | Primitive[]>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    clarity?: (...args: unknown[]) => void;
  }
}

const isBrowser = () => typeof window !== 'undefined';
const debug = () =>
  isBrowser() && (!!env.DEV || new URLSearchParams(window.location.search).has('analytics_debug'));

function clean(params: Params): Params {
  const out: Params = {};
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === '') continue;
    out[k] = v;
  }
  return out;
}

/** Core GA4 event sender (back-compat with the original signature). */
export function trackEvent(eventName: string, params: Params = {}) {
  if (!isBrowser() || typeof window.gtag !== 'function') return;
  const payload = clean(params);
  if (debug()) console.debug('[analytics] event:', eventName, payload);
  window.gtag('event', eventName, payload);
}

/* --------------------------------------------------------------------------
 * Campaign attribution (UTMs forwarded across the domain hop from the site)
 * ------------------------------------------------------------------------ */
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
const ATTR_FIRST = 'ava_attr_first';
const ATTR_LAST = 'ava_attr_last';

export function captureAttribution() {
  if (!isBrowser()) return;
  const params = new URLSearchParams(window.location.search);
  const data: Record<string, string> = {};
  UTM_KEYS.forEach((k) => {
    const v = params.get(k);
    if (v) data[k] = v;
  });
  if (Object.keys(data).length === 0) return;
  data.captured_at = new Date().toISOString();
  try {
    if (!localStorage.getItem(ATTR_FIRST)) localStorage.setItem(ATTR_FIRST, JSON.stringify(data));
    localStorage.setItem(ATTR_LAST, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export function getAttribution(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(ATTR_LAST) || '{}');
  } catch {
    return {};
  }
}

function attributionParams(): Params {
  const a = getAttribution();
  const out: Params = {};
  UTM_KEYS.forEach((k) => {
    if (a[k]) out[k] = a[k];
  });
  return out;
}

/** Enhanced page_landed (kept for back-compat; now also persists attribution). */
export function trackPageLanded() {
  captureAttribution();
  const params = new URLSearchParams(window.location.search);
  trackEvent('page_landed', {
    referrer: document.referrer || 'direct',
    utm_source: params.get('utm_source') ?? '',
    utm_medium: params.get('utm_medium') ?? '',
    utm_campaign: params.get('utm_campaign') ?? '',
  });
}

/* --------------------------------------------------------------------------
 * Funnel events (the critical path) — see MEASUREMENT-PLAN.md §6
 * ------------------------------------------------------------------------ */
export function trackAssessmentStarted(p: { resumed: boolean; entry_step_id: string }) {
  trackEvent('assessment_started', { ...attributionParams(), ...p });
}

export function trackStepView(p: {
  step_id: string;
  step_index: number;
  step_name: string;
  question_count: number;
}) {
  trackEvent('assessment_step_view', p);
}

export function trackStepComplete(p: {
  step_id: string;
  step_index: number;
  step_name: string;
  time_on_step: number;
  answers_count: number;
}) {
  trackEvent('assessment_step_complete', p);
}

export function trackStepBack(p: {
  from_step_id: string;
  to_step_id: string;
  from_index: number;
  to_index: number;
}) {
  trackEvent('assessment_step_back', p);
}

export function trackValidationError(p: { step_id: string; step_index: number; missing_count: number }) {
  trackEvent('assessment_validation_error', p);
}

/** Conversion: full assessment finished. */
export function trackAssessmentCompleted(p: {
  total_steps: number;
  time_in_assessment: number;
  time_buyback_score: number;
  readiness_score: number;
  qualification_status: string;
  outcome_id: string;
}) {
  trackEvent('assessment_completed', p);
}

export function trackResultsViewed(p: {
  time_buyback_score: number;
  readiness_score: number;
  qualification_status: string;
  archetype: string;
}) {
  trackEvent('results_viewed', p);
}

/** Conversion: lead captured (email → Notion). */
export function trackLead(p: { context: string; qualification_status?: string }) {
  trackEvent('generate_lead', { method: 'assessment', ...attributionParams(), ...p });
}

export function trackDownloadResults(p: { format: string; qualification_status?: string }) {
  trackEvent('download_results', p);
}

export function trackResultsCtaClick(p: {
  cta_id: string;
  cta_text?: string;
  qualification_status?: string;
  link_url?: string;
}) {
  trackEvent('results_cta_click', p);
}

export function trackAssessmentRetaken(p: {
  previous_time_buyback_score?: number;
  previous_readiness_score?: number;
}) {
  trackEvent('assessment_retaken', p);
}

/* --------------------------------------------------------------------------
 * Abandonment — fire once when the visitor leaves mid-funnel (beacon transport)
 * ------------------------------------------------------------------------ */
export interface AbandonState {
  startedAt: number | null;
  completed: boolean;
  lastStepId: string;
  lastStepIndex: number;
  furthestIndex: number;
  answeredCount: number;
}

export function initAbandonmentTracking(getState: () => AbandonState): () => void {
  if (!isBrowser()) return () => {};
  let sent = false;
  const handler = () => {
    if (sent || document.visibilityState !== 'hidden') return;
    const s = getState();
    if (!s.startedAt || s.completed) return;
    sent = true;
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'assessment_abandon', {
        last_step_id: s.lastStepId,
        last_step_index: s.lastStepIndex,
        furthest_index: s.furthestIndex,
        answered_count: s.answeredCount,
        time_in_assessment: Math.round((Date.now() - s.startedAt) / 1000),
        transport_type: 'beacon',
      });
    }
  };
  document.addEventListener('visibilitychange', handler);
  window.addEventListener('pagehide', handler);
  return () => {
    document.removeEventListener('visibilitychange', handler);
    window.removeEventListener('pagehide', handler);
  };
}

/* --------------------------------------------------------------------------
 * Consent Mode v2 (defaults set in index.html; this updates on user choice)
 * ------------------------------------------------------------------------ */
export type ConsentState = 'granted' | 'denied';

export function updateConsent(granted: boolean) {
  const v: ConsentState = granted ? 'granted' : 'denied';
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      ad_storage: v,
      analytics_storage: v,
      ad_user_data: v,
      ad_personalization: v,
    });
  }
  try {
    localStorage.setItem('jaa_consent', v);
  } catch {
    /* ignore */
  }
}

export function getStoredConsent(): ConsentState | null {
  try {
    const v = localStorage.getItem('jaa_consent');
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
}

/* --------------------------------------------------------------------------
 * Microsoft Clarity
 * ------------------------------------------------------------------------ */
let clarityStarted = false;

export function initClarity() {
  if (typeof window === 'undefined' || clarityStarted || !CLARITY_PROJECT_ID) return;
  clarityStarted = true;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  (function (c: any, l: Document, a: string, r: string, i: string) {
    c[a] =
      c[a] ||
      function (...args: unknown[]) {
        (c[a].q = c[a].q || []).push(args);
      };
    const t = l.createElement(r) as HTMLScriptElement;
    t.async = true;
    t.src = 'https://www.clarity.ms/tag/' + i;
    const y = l.getElementsByTagName(r)[0];
    y?.parentNode?.insertBefore(t, y);
  })(window, document, 'clarity', 'script', CLARITY_PROJECT_ID);
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

export function clarityTag(key: string, value: string) {
  if (typeof window !== 'undefined' && typeof window.clarity === 'function') {
    window.clarity('set', key, value);
  }
}

export function clarityConsent(granted = true) {
  if (typeof window !== 'undefined' && typeof window.clarity === 'function') {
    window.clarity('consent', granted);
  }
}

/* --------------------------------------------------------------------------
 * Catch-all click tracking — fires element_click for ANY button/link (100% coverage).
 * The funnel/step events still fire their own specific events; this is the safety net.
 * ------------------------------------------------------------------------ */
export function initClickTracking(): () => void {
  if (typeof document === 'undefined') return () => {};
  const handler = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    const el = target?.closest?.('a, button, [role="button"]') as HTMLElement | null;
    if (!el) return;
    const href = (el as HTMLAnchorElement).href || '';
    const text = (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 100);
    trackEvent('element_click', {
      element_type: el.tagName === 'A' ? 'link' : 'button',
      element_text: text || undefined,
      link_url: href || undefined,
    });
  };
  document.addEventListener('click', handler, true);
  return () => document.removeEventListener('click', handler, true);
}
