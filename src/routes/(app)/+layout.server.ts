import { loadUserFromSession } from '$lib/server/better-auth';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const user = await loadUserFromSession(event);

	console.log('user', user);

	if (!user) {
		throw redirect(302, `/login?redirect=${event.url.pathname}`);
	} else if (user.accountStatus !== 'active') {
		redirect(302, '/logout');
	}
	event.locals.user = user;

	return { user };
};
