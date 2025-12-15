import { createApiClient } from '$lib/API/apiClient.js';
import { getPlansAvailableToUpgrade } from '$lib/API/subscription.js';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	if (!event.cookies.get('accessToken')) redirect(302, '/login');
	const token = event.cookies.get('accessToken');

	console.log('Load account', token);

	try {
		const api = createApiClient(event);
		const availablePlans = await getPlansAvailableToUpgrade(api);
		console.log({ availablePlans });
		return { availablePlans };
	} catch (error) {
		console.error(error);
	}
};
