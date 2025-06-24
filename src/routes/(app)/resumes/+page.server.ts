import { PUBLIC_API_URL } from '$env/static/public';
export const load = async (event) => {
	const token = event.cookies.get('accessToken');

	try {
		const res = await fetch(`${PUBLIC_API_URL}/resume/my`, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		});
		const resumes = await res.json();

		return { resumes };
	} catch (error) {
		console.error(error);
	}
};
