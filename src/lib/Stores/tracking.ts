import mixpanel from 'mixpanel-browser';
import { writable } from 'svelte/store';

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

	return {
		subscribe,
		pageViewEvent
	};
}

export const trackingStore = createTrackingStore();
