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
			const conversionPageName = pageName.replace(/\s+/g, '_').toLowerCase();
			safeGoogleTagTracking(conversionPageName, { pageName, ...options });
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
			const conversionAction = actionName.replace(/\s+/g, '_').toLowerCase();
			safeGoogleTagTracking(conversionAction, { pageName, ...options });
			safeMixpanelTrack(actionName, {
				pageName,
				...options
			});
		}
	}

	/* 
	@deprecated
	**/
	function trackConversion(
		actionName: string,
		conversionID: string,
		options: { [key: string]: string | null | boolean } = {}
	) {
		const { pageName } = get({ subscribe }); // get current store value

		console.log('Tracking Conversion', { actionName, conversionID, pageName, options });

		if (process.env.NODE_ENV === 'production' && trackingEnabled) {
			safeGoogleTagTracking(conversionID, { pageName, ...options });
			safeMixpanelTrack(actionName, {
				pageName,
				conversionID,
				...options
			});
		}
	}

	return {
		subscribe,
		pageViewEvent,
		trackAction,
		trackConversion
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
