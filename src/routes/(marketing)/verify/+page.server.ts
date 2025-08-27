import { verifyEmail } from '$lib/API/user.js';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	if (!event.cookies.get('accessToken')) redirect(302, '/login');
	const token = event.cookies.get('accessToken') || '';
	const verifyTokenCode = event.url.searchParams.get('token') || '';

	try {
		const tokenDetails = await verifyEmail(token, { token: verifyTokenCode });
		return { tokenDetails };
	} catch (error) {
		console.error(error);
	}
};
