import { PUBLIC_API_URL } from '$env/static/public';
export const load = async (event) => {
	const token = event.cookies.get('accessToken');

	try {
		const res = await fetch(`${PUBLIC_API_URL}/meetings/my?page=1&limit=20`, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		});
		const meetings = await res.json();

		return { meetings };
	} catch (error) {
		console.error(error);
	}
};
