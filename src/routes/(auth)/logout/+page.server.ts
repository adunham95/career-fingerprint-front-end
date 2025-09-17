import { createApiClient } from '$lib/API/apiClient.js';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const api = createApiClient(event);
	const user = await api.get('/auth/logout');
	console.log({ user });
	event.cookies.delete('accessToken', { path: '/' });
	event.locals.user = null;
	redirect(303, '/');
};
