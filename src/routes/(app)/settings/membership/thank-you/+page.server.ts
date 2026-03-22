import { createApiClient } from '$lib/API/apiClient.js';
import { validateSubscription } from '$lib/API/subscription';

export const load = async (event) => {
	const sessionID = event.url.searchParams.get('session_id') || '';

	try {
		const api = createApiClient(event);
		const validated = await validateSubscription(sessionID, api);
		if (event?.locals?.user?.subscription) {
			event.locals.user.subscription = validated;
		}
		return { validated };
	} catch (error) {
		console.error(error);
	}
};
