import { createApiClient } from '$lib/API/apiClient.js';
import { redirect } from '@sveltejs/kit';
import type { Organization } from '../../../../../app.js';

export const load = async (event) => {
	console.log({ local: event.locals.user });
	if (!event.locals.user) redirect(302, '/login');

	try {
		const api = createApiClient(event);
		const org = await api.get<Organization>(`/org/${event.params.id}`);

		return { org, user: event.locals.user };
	} catch (error) {
		console.error(error);
	}
};
