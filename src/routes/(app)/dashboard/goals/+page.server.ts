import { createApiClient } from '$lib/API/apiClient';
import type { Meeting } from '../../../../app';

export const load = async (event) => {
	try {
		const api = createApiClient(event);
		const [meetings] = await Promise.all([
			api.get<Meeting[]>('/meetings/my/upcoming', { page: 1, limit: 3 })
		]);
		return { meetings: meetings ?? [] };
	} catch (error) {
		console.error(error);
	}
};
