import { getSubscriptionDetails } from '$lib/API/subscription.js';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	if (!event.cookies.get('accessToken')) redirect(302, '/login');
	const token = event.cookies.get('accessToken');

	console.log('Load account', token);

	try {
		const membershipDetails = await getSubscriptionDetails(token);
		return { membershipDetails };
	} catch (error) {
		console.error(error);
	}
};
