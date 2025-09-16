import { PUBLIC_API_URL } from '$env/static/public';

export async function validateAuthToken(token: string) {
	try {
		const res = await fetch(`${PUBLIC_API_URL}/auth/current-user`, {
			credentials: 'include',
			headers: {
				Authorization: 'Bearer ' + token
			}
		});
		const user = await res.json();
		if (user?.message === 'Unauthorized' || !user) {
			return { user: null };
		}
		return { user };
	} catch (error) {
		console.error(error);
		return { user: null };
	}
}
