import { createApiClient } from '$lib/API/apiClient.js';
import type { Organization } from '../../../../../app.js';

export const load = async (event) => {
	try {
		const api = createApiClient(event);
		const orgs = await api.get<Organization[]>(`/org`);
		return { orgs };
	} catch (error) {
		console.error(error);
	}
};
