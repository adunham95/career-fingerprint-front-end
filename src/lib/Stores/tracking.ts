import mixpanel from 'mixpanel-browser';
import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import { PUBLIC_MIXPANEL_ENABLED } from '$env/static/public';

interface TrackingObject {
	pageName?: string;
	component?: string;
}

function createTrackingStore() {
	const { subscribe, update } = writable<TrackingObject>({});
	const trackingEnabled = browser && PUBLIC_MIXPANEL_ENABLED === 'true';

	function pageViewEvent(pageName: string, options: { [key: string]: string | boolean } = {}) {
		console.log('Tracking', { pageName, options });

		if (process.env.NODE_ENV === 'production' && trackingEnabled) {
			safeMixpanelTrack(`${pageName} Page View`, {
				pageName,
				...options
			});
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
			safeMixpanelTrack(actionName, {
				pageName,
				...options
			});
		}
	}

	return {
		subscribe,
		pageViewEvent,
		trackAction
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

export const trackingStore = createTrackingStore();
