import { createApiClient } from '$lib/API/apiClient.js';
import type { User } from '../../../../../../app.js';

export const load = async (event) => {
	const id = event.params.id;

	try {
		const api = createApiClient(event);
		const orgAdmins = await api.get<User[]>(`/org/${id}/admins`);
		return { admins: orgAdmins };
	} catch (error) {
		console.error(error);
	}
};
