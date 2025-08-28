import { verifyEmail } from '$lib/API/user.js';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	if (!event.cookies.get('accessToken')) redirect(302, '/login');
	const token = event.cookies.get('accessToken') || '';
	const verifyTokenCode = event.url.searchParams.get('token') || '';
	const showFreeTrial = event.url.searchParams.get('showFreeTrial') === 'true' || false;

	console.log({ verifyTokenCode, showFreeTrial });

	try {
		const tokenDetails = await verifyEmail(token, { token: verifyTokenCode, showFreeTrial });
		return { tokenDetails };
	} catch (error) {
		console.error(error);
		return { tokenDetails: { verified: false } };
	}
};
