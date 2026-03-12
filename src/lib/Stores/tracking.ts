import mixpanel from 'mixpanel-browser';
import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import { PUBLIC_MIXPANEL_ENABLED } from '$env/static/public';

interface TrackingObject {
	pageName?: string;
}

const isProduction = process.env.NODE_ENV === 'production';

let currentTimedPage: string | null = null;

function isMixpanelReady(): boolean {
	return !!mixpanel && typeof mixpanel.track === 'function' && (mixpanel as any).__loaded === true;
}

function toSnakeCase(str: string): string {
	return str.replace(/\s+/g, '_').toLowerCase();
}

function flushTimeOnPage() {
	if (!currentTimedPage) return;
	safeMixpanelTrack('Time on Page', { pageName: currentTimedPage });
	currentTimedPage = null;
}

function createTrackingStore() {
	const store = writable<TrackingObject>({});
	const { subscribe, update } = store;
	const trackingEnabled = browser && PUBLIC_MIXPANEL_ENABLED === 'true';
	const shouldTrack = isProduction && trackingEnabled;

	function pageViewEvent(pageName: string, options: { [key: string]: string | boolean } = {}) {
		if (!isProduction) console.log('Tracking', { pageName, options });

		if (shouldTrack) {
			safeGoogleTagTracking(`${toSnakeCase(pageName)}_page_view`, { pageName, ...options });
			safeMixpanelTrack(`${pageName} Page View`, { pageName, ...options });

			flushTimeOnPage();
			try {
				mixpanel.time_event('Time on Page');
				currentTimedPage = pageName;
			} catch {
				// mixpanel not ready
			}
		}

		update((obj) => ({ ...obj, pageName }));
	}

	function trackAction(
		actionName: string,
		options: { [key: string]: string | null | boolean | string[] } = {}
	) {
		const { pageName } = get(store);

		if (!isProduction) console.log('Tracking Action', { actionName, pageName, options });

		if (shouldTrack) {
			safeGoogleTagTracking(toSnakeCase(actionName), { pageName, ...options });
			safeMixpanelTrack(actionName, { pageName, ...options });
		}
	}

	function trackSession() {
		if (shouldTrack) safeMixpanelSessionReplay();
	}

	function identifyUser(userId: string, email: string) {
		if (shouldTrack) safeMixpanelIdentify(userId, email);
	}

	return {
		subscribe,
		pageViewEvent,
		trackAction,
		identifyUser,
		flushTimeOnPage,
		trackSession
	};
}

function safeMixpanelTrack(event: string, props: Record<string, any>) {
	if (!isMixpanelReady()) return;
	try {
		mixpanel.track(event, props);
	} catch (err) {
		console.warn('Mixpanel track failed:', err);
	}
}

function safeMixpanelIdentify(userId: string, email: string) {
	if (!isMixpanelReady()) return;
	try {
		mixpanel.identify(userId);
		mixpanel.people.set({ $email: email });
	} catch (err) {
		console.warn('Mixpanel identify failed:', err);
	}
}

function safeMixpanelSessionReplay() {
	if (!isMixpanelReady()) return;
	try {
		mixpanel.start_session_recording();
	} catch (err) {
		console.warn('Mixpanel session recording failed:', err);
	}
}

function safeGoogleTagTracking(event: string, props: Record<string, any>) {
	window.dataLayer = window.dataLayer || [];
	window.dataLayer.push({ event: event.toLowerCase(), ...props });
}

export const trackingStore = createTrackingStore();
