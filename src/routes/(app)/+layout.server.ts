import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	console.log({ local: event.locals.user });
	console.log(event.url.pathname);
	if (!event.locals.user) redirect(302, `/login?redirect=${event.url.pathname}`);
	if (event.locals.user.accountStatus !== 'active') redirect(302, '/login');

	return { user: event.locals.user };
};
