import mixpanel from 'mixpanel-browser';
import { writable, get } from 'svelte/store';

interface TrackingObject {
	pageName?: string;
	component?: string;
}

function createTrackingStore() {
	const { subscribe, update } = writable<TrackingObject>({});

	function pageViewEvent(pageName: string, options: { [key: string]: string } = {}) {
		console.log('Tracking', { pageName, options });

		if (process.env.NODE_ENV === 'production') {
			mixpanel.track('Page View', {
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

	function trackAction(actionName: string, options: { [key: string]: string } = {}) {
		const { pageName } = get({ subscribe }); // get current store value

		console.log('Tracking Action', { actionName, pageName, options });

		if (process.env.NODE_ENV === 'production') {
			mixpanel.track(actionName, {
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

export const trackingStore = createTrackingStore();
