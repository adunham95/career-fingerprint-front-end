import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	console.log({ local: event.locals.user });
	if (!event.locals.user) redirect(302, '/login');
	redirect(307, '/dashboard');
};
