import { PUBLIC_API_URL } from '$env/static/public';
import { getSkillList } from '$lib/API/skill-list';
import type { Education, JobPosition } from '../../../app';

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
		const skillList = await getSkillList();
		return { education, jobs, skillList };
	} catch (error) {
		console.error(error);
	}
};
