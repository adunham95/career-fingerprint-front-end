import { PUBLIC_API_URL } from '$env/static/public';
import type { CoverLetter } from '$lib/API/cover-letters.js';

export const load = async (event) => {
	const token = event.cookies.get('accessToken');
	const id = event.params.id;

	try {
		const resCV = await fetch(`${PUBLIC_API_URL}/cover-letters/jobApp/${id}`, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		});

		const coverLetter: CoverLetter = await resCV.json();
		return { coverLetter };
	} catch (error) {
		console.error(error);
	}
};
