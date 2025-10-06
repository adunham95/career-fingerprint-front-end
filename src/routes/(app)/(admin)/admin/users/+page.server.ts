import { createApiClient } from '$lib/API/apiClient.js';
import type { CurrentUser } from '../../../../../app.js';

export const load = async (event) => {
	try {
		const api = createApiClient(event);
		const users = await api.get<CurrentUser[]>(`/users`);
		return { users };
	} catch (error) {
		console.error(error);
	}
};
