import { createApiClient } from '$lib/API/apiClient.js';
export const load = async (event) => {
	try {
		const api = createApiClient(event);
		const meetings = await api.get('/meetings/my', { page: 1, limit: 20 });
		return { meetings };
	} catch (error) {
		console.error(error);
	}
};
