import { createApiClient } from '$lib/API/apiClient.js';
import type { Meeting } from '../../../app.js';
export const load = async (event) => {
	try {
		const api = createApiClient(event);
		const meetings = await api.get<Meeting[]>('/meetings/my', { page: 1, limit: 20 });
		return { meetings };
	} catch (error) {
		console.error(error);
	}
};
