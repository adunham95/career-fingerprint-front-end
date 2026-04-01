import { PUBLIC_AMPLITUDE_KEY } from '$env/static/public';
import * as amplitude from '@amplitude/unified';

function shouldDisableAnalytics(): boolean {
	if (typeof window === 'undefined') return true; // SSR guard

	// Headless Chrome (bots, Playwright, Puppeteer, etc.)
	if (/HeadlessChrome/.test(navigator.userAgent)) return true;

	// Prismic preview cookie
	if (document.cookie.includes('io.prismic.preview')) return true;

	// Optional: preview hostnames
	const host = window.location.hostname;
	if (host.endsWith('.prismic.io') || host.includes('preview')) return true;

	return false;
}

export function initAmplitude() {
	if (shouldDisableAnalytics()) return;

	amplitude.initAll(PUBLIC_AMPLITUDE_KEY, {
		analytics: {
			autocapture: {
				attribution: true,
				fileDownloads: true,
				formInteractions: false,
				pageViews: false,
				sessions: true,
				elementInteractions: false,
				networkTracking: true,
				webVitals: true,
				frustrationInteractions: {
					thrashedCursor: true,
					errorClicks: true,
					deadClicks: true,
					rageClicks: true
				}
			}
		},
		sessionReplay: { sampleRate: 1 }
	});
}

export function trackAmplitude(event: string, properties?: Record<string, unknown>) {
	if (shouldDisableAnalytics()) return;
	amplitude.track(event, properties);
}

export function setAmplitudeUser(userID: string) {
	if (shouldDisableAnalytics()) return;
	amplitude.setUserId(userID);
}
