import { validateSubscription } from '$lib/API/subscription';

import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	if (!event.cookies.get('accessToken')) redirect(302, '/login');
	const token = event.cookies.get('accessToken');
	const sessionID = event.url.searchParams.get('session_id');

	try {
		const validated = await validateSubscription(sessionID, token);
		event.locals.user.subscription = validated;
		event.locals.planLevel = validated?.plan?.level;
		return { validated };
	} catch (error) {
		console.error(error);
	}
};
