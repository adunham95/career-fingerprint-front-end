import { createApiClient } from '$lib/API/apiClient';
import type { Achievement, Meeting } from '../../../app.js';

export const load = async (event) => {
	try {
		const api = createApiClient(event);
		const achievements = await api.get<Achievement[]>('/achievement/my', { page: 1, limit: 5 });
		const meetings = await api.get<Meeting[]>('/meetings/my/upcoming', { page: 1, limit: 3 });
		return { achievements, meetings };
	} catch (error) {
		console.error(error);
	}
};
