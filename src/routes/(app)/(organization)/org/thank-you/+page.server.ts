import { validateSubscription } from '$lib/API/subscription';

import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	if (!event.cookies.get('accessToken')) redirect(302, '/login');
	if (!event.locals.user) redirect(302, '/login');
	const token = event.cookies.get('accessToken');
	const sessionID = event.url.searchParams.get('session_id') || '';

	try {
		console.log({ orgID: event.locals.user.orgID });
		await validateSubscription(sessionID, token);
	} catch (error) {
		console.error(error);
	}
	redirect(302, `/org/${event.locals.user.orgID}`);
};
