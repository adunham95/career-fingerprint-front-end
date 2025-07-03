import { PUBLIC_API_URL } from '$env/static/public';
import type { JobApplication } from '../../../app.js';

export const load = async (event) => {
	const token = event.cookies.get('accessToken');

	try {
		const resApplications = await fetch(`${PUBLIC_API_URL}/job-applications/my`, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		});

		const applications: JobApplication[] = await resApplications.json();
		return { applications };
	} catch (error) {
		console.error(error);
	}
};
