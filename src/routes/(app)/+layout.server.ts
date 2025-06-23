import { PUBLIC_API_URL } from '$env/static/public';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	if (!event.cookies.get('accessToken')) redirect(302, '/login');
	const token = event.cookies.get('accessToken');

	console.log('Load account', token);

	try {
		const res = await fetch(`${PUBLIC_API_URL}/auth/current-user`, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		});
		const user = await res.json();
		console.log({ user });
		return { user };
	} catch (error) {
		console.error(error);
	}
};
