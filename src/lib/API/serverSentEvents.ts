import { PUBLIC_API_URL } from '$env/static/public';
import { toastStore } from '$lib/Components/Toasts/toast';

let source: EventSource | null = null;

export function initSSE() {
	if (source) return; // avoid duplicate connections

	source = new EventSource(`${PUBLIC_API_URL}/sse/events`, {
		withCredentials: true
	});

	source.onmessage = (event) => {
		try {
			const data = JSON.parse(event.data);

			toastStore.show({
				type: data.type ?? 'info',
				message: data.message ?? 'Update',
				details: data.details,
				duration: data.duration ?? 4000
			});
		} catch (err) {
			console.error('Error parsing SSE event:', err);
		}
	};

	// source.onerror = () => {
	// 	toastStore.show({
	// 		type: 'error',
	// 		message: 'Lost connection to live updates',
	// 		duration: 5000
	// 	});
	// };
}
