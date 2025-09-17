import { createApiClient } from '$lib/API/apiClient';
import type { Achievement } from '../../../app.js';

export const load = async (event) => {
	try {
		const api = createApiClient(event);
		const achievements = await api.get<Achievement[]>('/achievement/my', { includeLinked: true });
		return { achievements };
	} catch (error) {
		console.error(error);
	}
};
