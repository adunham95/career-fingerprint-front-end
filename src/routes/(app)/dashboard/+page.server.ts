import { createApiClient } from '$lib/API/apiClient';

export const load = async (event) => {
	try {
		const api = createApiClient(event);
		const achievements = await api.get('/achievement/my', { page: 1, limit: 5 });
		const meetings = await api.get('/meetings/my/upcoming', { page: 1, limit: 3 });
		return { achievements, meetings };
	} catch (error) {
		console.error(error);
	}
};
