import { createApiClient } from '$lib/API/apiClient.js';
import { validateSubscription } from '$lib/API/subscription';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const sessionID = event.url.searchParams.get('session_id') || '';
	let orgID;

	try {
		const api = createApiClient(event);
		const data = await validateSubscription(sessionID, api);
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
