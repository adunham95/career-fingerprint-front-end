import mixpanel from 'mixpanel-browser';
import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import { PUBLIC_MIXPANEL_ENABLED } from '$env/static/public';

interface TrackingObject {
	pageName?: string;
	component?: string;
}

let currentTimedPage: string | null = null;

function flushTimeOnPage() {
	if (!currentTimedPage) return;
	safeMixpanelTrack('Time on Page', { pageName: currentTimedPage });
	currentTimedPage = null;
}

function createTrackingStore() {
	const { subscribe, update } = writable<TrackingObject>({});
	const trackingEnabled = browser && PUBLIC_MIXPANEL_ENABLED === 'true';

	function pageViewEvent(pageName: string, options: { [key: string]: string | boolean } = {}) {
		console.log('Tracking', { pageName, options });

		if (process.env.NODE_ENV === 'production' && trackingEnabled) {
			const conversionPageName = pageName.replace(/\s+/g, '_').toLowerCase();
			safeGoogleTagTracking(`${conversionPageName}_page_view`, { pageName, ...options });
			safeMixpanelTrack(`${pageName} Page View`, {
				pageName,
				...options
			});

			// Flush previous page timer then start a new one
			flushTimeOnPage();
			try {
				mixpanel.time_event('Time on Page');
				currentTimedPage = pageName;
			} catch {
				// mixpanel not ready
			}
		}

		update((trackingObject) => {
			return {
				...trackingObject,
				pageName
			};
		});
	}

	function trackAction(
		actionName: string,
		options: { [key: string]: string | null | boolean } = {}
	) {
		const { pageName } = get({ subscribe }); // get current store value

		console.log('Tracking Action', { actionName, pageName, options });

		if (process.env.NODE_ENV === 'production' && trackingEnabled) {
			const conversionAction = actionName.replace(/\s+/g, '_').toLowerCase();
			safeGoogleTagTracking(conversionAction, { pageName, ...options });
			safeMixpanelTrack(actionName, {
				pageName,
				...options
			});
		}
	}

	function identifyUser(userId: string, email: string) {
		if (process.env.NODE_ENV === 'production' && trackingEnabled) {
			try {
				mixpanel.identify(userId);
				mixpanel.people.set({ $email: email });
			} catch (err) {
				console.warn('Mixpanel identify failed:', err);
			}
		}
	}

	return {
		subscribe,
		pageViewEvent,
		trackAction,
		identifyUser,
		flushTimeOnPage
	};
}

function safeMixpanelTrack(event: string, props: Record<string, any>) {
	if (!mixpanel || typeof mixpanel.track !== 'function') return;
	// Mixpanel sometimes sets a flag when not initialized
	if (mixpanel.__loaded !== true) return;

	try {
		mixpanel.track(event, props);
	} catch (err) {
		console.warn('Mixpanel track failed:', err);
	}
}

function safeGoogleTagTracking(event: string, props: Record<string, any>) {
	if (window) {
		window.dataLayer = window.dataLayer || [];
		window.dataLayer.push({
			event: event.toLocaleLowerCase(),
			...props
		});
	}
}

export const trackingStore = createTrackingStore();
