import { PUBLIC_API_URL } from '$env/static/public';
import type { Education, JobPosition } from '../../../../app';

export const load = async (event) => {
	const token = event.cookies.get('accessToken');

	try {
		const resEducation = await fetch(`${PUBLIC_API_URL}/education/my`, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		});
		const resJobs = await fetch(`${PUBLIC_API_URL}/job-positions/my`, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		});
		const education: Education[] = await resEducation.json();
		const jobs: JobPosition[] = await resJobs.json();
		return { education, jobs };
	} catch (error) {
		console.error(error);
	}
};
