import { createApiClient } from '$lib/API/apiClient';
import type { Meeting } from '../../../app.js';
export const load = async (event) => {
	try {
		const api = createApiClient(event);
		const meetings = await api.get<Meeting[]>('/meetings/my/upcoming');

		return { meetings };
	} catch (error) {
		console.error(error);
	}
};
