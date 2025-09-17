import { createApiClient } from '$lib/API/apiClient.js';
import { validateSubscription } from '$lib/API/subscription';

import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	if (!event.cookies.get('accessToken')) redirect(302, '/login');
	if (!event.locals.user) redirect(302, '/login');
	const sessionID = event.url.searchParams.get('session_id') || '';

	try {
		const api = createApiClient(event);
		const validated = await validateSubscription(sessionID, api);
		event.locals.user.subscription = validated;
		return { validated };
	} catch (error) {
		console.error(error);
	}
};
