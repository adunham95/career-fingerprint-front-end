import { PUBLIC_API_URL } from '$env/static/public';
import type { JobApplication } from '../../../../app';

export const load = async (event) => {
	const token = event.cookies.get('accessToken');
	const id = event.params.id;

	try {
		const resApplication = await fetch(`${PUBLIC_API_URL}/job-applications/${id}`, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		});

		const application: JobApplication = await resApplication.json();
		return { application };
	} catch (error) {
		console.error(error);
	}
};
