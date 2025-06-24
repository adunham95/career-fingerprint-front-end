import { PUBLIC_API_URL } from '$env/static/public';

export const load = async (event) => {
	const token = event.cookies.get('accessToken');
	console.log(event.params.id);

	try {
		const res = await fetch(`${PUBLIC_API_URL}/resume/${event.params.id}`, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		});
		const resume = await res.json();
		console.log({ resume });
		return { resume };
	} catch (error) {
		console.error(error);
	}
};
