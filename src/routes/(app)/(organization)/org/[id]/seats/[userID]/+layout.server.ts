import { createApiClient } from '$lib/API/apiClient';
import type { User } from '../../../../../../../app.js';

export const load = async (event) => {
	try {
		const api = createApiClient(event);

		const [currentUser] = await Promise.all([await api.get<User>(`/users/${event.params.userID}`)]);

		return { currentUser };
	} catch (error) {
		console.error(error);
	}
};
