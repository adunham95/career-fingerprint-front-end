import { createApiClient } from '$lib/API/apiClient.js';

export const load = async (event) => {
	try {
		const api = createApiClient(event);
		const adminDash = await api.get(`/admin/dashboard`);
		return { adminDash };
	} catch (error) {
		console.error(error);
	}
};
