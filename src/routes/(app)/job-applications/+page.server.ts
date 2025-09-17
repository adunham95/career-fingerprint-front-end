import { createApiClient } from '$lib/API/apiClient.js';

export const load = async (event) => {
	try {
		const api = createApiClient(event);
		const applications = await api.get('/job-applications/my');
		return { applications };
	} catch (error) {
		console.error(error);
	}
};
