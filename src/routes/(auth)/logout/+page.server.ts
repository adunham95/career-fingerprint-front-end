import { PUBLIC_API_URL } from '$env/static/public';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const res = await fetch(`${PUBLIC_API_URL}/auth/logout`, { credentials: 'include' });
	const user = await res.json();
	console.log({ user });
	event.cookies.delete('accessToken', { path: '/' });
	event.locals.user = null;
	redirect(303, '/');
};
