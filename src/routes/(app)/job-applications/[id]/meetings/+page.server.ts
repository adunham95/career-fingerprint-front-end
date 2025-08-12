import { PUBLIC_API_URL } from '$env/static/public';
import type { Meeting } from '../../../../../app.js';

export const load = async (event) => {
	const token = event.cookies.get('accessToken');
	const id = event.params.id;

	try {
		const resMeetings = await fetch(`${PUBLIC_API_URL}/meetings/job-application/${id}`, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		});

		const meetings: Meeting[] = await resMeetings.json();
		return { meetings };
	} catch (error) {
		console.error(error);
	}
};
