import { validateSubscription } from '$lib/API/subscription';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	if (!event.cookies.get('accessToken')) redirect(302, '/login');
	if (!event.locals.user) redirect(302, '/login');
	const token = event.cookies.get('accessToken');
	const sessionID = event.url.searchParams.get('session_id') || '';
	let orgID;

	try {
		const data = await validateSubscription(sessionID, token);
		console.log('validSubscriptionData', { data });
		orgID = data?.org?.id;
	} catch (error) {
		console.error(error);
	}

	if (orgID) {
		redirect(302, `/org/${orgID}`);
	} else {
		redirect(302, '/dashboard');
	}
};
