import { createApiClient } from '$lib/API/apiClient.js';
import { redirect } from '@sveltejs/kit';
import type { Organization } from '../../../../../app.js';
import { loadUser } from '$lib/server/auth.js';

export const load = async (event) => {
	const user = await loadUser(event);
	if (!user) redirect(302, '/login');

	try {
		const api = createApiClient(event);
		const org = await api.get<Organization>(`/org/${event.params.id}?includeSubscription=true`);

		return { org, user };
	} catch (error) {
		console.error(error);
	}
};
