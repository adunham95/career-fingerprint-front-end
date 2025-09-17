import { createApiClient } from '$lib/API/apiClient.js';

export const load = async (event) => {
	const id = event.params.id;

	try {
		const api = createApiClient(event);
		const orgAdmins = await api.get(`/org/${id}/admins`);
		return { admins: orgAdmins };
	} catch (error) {
		console.error(error);
	}
};
