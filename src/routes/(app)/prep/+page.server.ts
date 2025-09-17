import { createApiClient } from '$lib/API/apiClient';
export const load = async (event) => {
	try {
		const api = createApiClient(event);
		const meetings = await api.get('/meetings/my');

		return { meetings };
	} catch (error) {
		console.error(error);
	}
};
