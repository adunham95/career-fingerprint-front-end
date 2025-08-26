import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	if (!event.cookies.get('accessToken')) redirect(302, '/login');
	if (!event.locals.user) redirect(302, '/login');
	if (!event.locals.user.orgID) redirect(302, '/dashboard');
};
