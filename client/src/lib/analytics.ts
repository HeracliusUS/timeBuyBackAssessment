declare function gtag(...args: unknown[]): void;

export function trackEvent(eventName: string, params?: Record<string, string>) {
  if (typeof gtag === 'undefined') return;
  gtag('event', eventName, params);
}

export function trackPageLanded() {
  const params = new URLSearchParams(window.location.search);
  trackEvent('page_landed', {
    referrer: document.referrer || 'direct',
    utm_source: params.get('utm_source') ?? '',
    utm_medium: params.get('utm_medium') ?? '',
    utm_campaign: params.get('utm_campaign') ?? '',
  });
}
