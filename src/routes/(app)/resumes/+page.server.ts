import { createApiClient } from '$lib/API/apiClient.js';
export const load = async (event) => {
	try {
		const api = createApiClient(event);
		const resumes = await api.get('/resume/my');

		return { resumes };
	} catch (error) {
		console.error(error);
	}
};
