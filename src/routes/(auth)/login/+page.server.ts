import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	console.log({ local: event.locals.user });
	if (event.locals.user) redirect(302, '/dashboard');

	const redirectPath = event.url.searchParams.get('redirect') || '/dashboard';

	return { redirectPath };
};
