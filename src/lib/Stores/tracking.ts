import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import { setAmplitudeUser, trackAmplitude } from '$lib/Utils/Amplitude';

declare global {
	interface Window {
		dataLayer: Record<string, any>[];
	}
}

interface TrackingObject {
	pageName?: string;
}

const isProduction = process.env.NODE_ENV === 'production';

function toSnakeCase(str: string): string {
	return str.replace(/\s+/g, '_').toLowerCase();
}

function createTrackingStore() {
	const store = writable<TrackingObject>({});
	const { subscribe, update } = store;
	const trackingEnabled = browser;
	const shouldTrack = isProduction && trackingEnabled;

	function pageViewEvent(pageName: string, options: { [key: string]: string | boolean } = {}) {
		if (!isProduction) console.log('Tracking', { pageName, options });

		if (shouldTrack) {
			safeGoogleTagTracking(`${toSnakeCase(pageName)}_page_view`, { pageName, ...options });
			trackAmplitude(`${pageName} Page View`, { pageName, ...options });
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
			trackAmplitude(actionName, { pageName, ...options });
		}
	}

	function trackSession() {}

	function identifyUser(userId: string, email: string) {
		if (!isProduction) console.log('Identify User', { userId, email });
		if (shouldTrack) {
			setAmplitudeUser(email);
		}
	}

	return {
		subscribe,
		pageViewEvent,
		trackAction,
		identifyUser,
		trackSession
	};
}

function safeGoogleTagTracking(event: string, props: Record<string, any>) {
	try {
		window.dataLayer = window.dataLayer || [];
		window.dataLayer.push({ event: event.toLowerCase(), ...props });
	} catch (err) {
		console.warn('GTM tracking failed:', err);
	}
}

export const trackingStore = createTrackingStore();
