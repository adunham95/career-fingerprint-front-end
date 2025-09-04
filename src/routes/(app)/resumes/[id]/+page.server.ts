import { PUBLIC_API_URL } from '$env/static/public';
import { getSkillList } from '$lib/API/skill-list';
import type { Education, JobPosition } from '../../../../app';

export const load = async (event) => {
	const token = event.cookies.get('accessToken');
	console.log(event.params.id);

	try {
		const resResumeDetails = await fetch(`${PUBLIC_API_URL}/resume/${event.params.id}`, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		});
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
		const resume = await resResumeDetails.json();
		const education: Education[] = await resEducation.json();
		const jobs: JobPosition[] = await resJobs.json();
		const mySkills = await getSkillList(token);
		return { resume, education, jobs, mySkills };
	} catch (error) {
		console.error(error);
	}
};
