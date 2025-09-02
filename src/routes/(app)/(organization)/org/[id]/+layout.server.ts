import { PUBLIC_API_URL } from '$env/static/public';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	console.log({ local: event.locals.user });
	if (!event.locals.user) redirect(302, '/login');
	const token = event.cookies.get('accessToken');

	try {
		const resOrg = await fetch(`${PUBLIC_API_URL}/org/${event.params.id}`, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		});

		const org = await resOrg.json();

		return { org, user: event.locals.user };
	} catch (error) {
		console.error(error);
	}
};
