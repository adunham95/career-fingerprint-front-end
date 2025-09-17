import { createApiClient } from '$lib/API/apiClient';

export const load = async (event) => {
	try {
		const api = createApiClient(event);
		const achievements = await api.get('/achievement/my', { includeLinked: true });
		return { achievements };
	} catch (error) {
		console.error(error);
	}
};
