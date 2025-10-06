import { redirect } from '@sveltejs/kit';
import { loadUser } from '$lib/server/auth.js';

export const load = async (event) => {
	const user = await loadUser(event);
	if (!user) redirect(302, '/login');

	console.log(user.userType);

	if (user.userType !== 'platform-admin') redirect(302, '/dashboard');

	try {
		return { user };
	} catch (error) {
		console.error(error);
	}
};
