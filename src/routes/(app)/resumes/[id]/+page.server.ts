import { createApiClient } from '$lib/API/apiClient';
import type { Education, JobPosition, Resume, SkillData } from '../../../../app';

export const load = async (event) => {
	console.log(event.params.id);

	try {
		const api = createApiClient(event);
		const resume = await api.get<Resume>(`/resume/${event.params.id}`);
		const education = await api.get<Education[]>('/education/my');
		const jobs = await api.get<JobPosition[]>('/job-positions/my');
		const skillList = await api.get<SkillData>('/skill-list/my');

		return { resume, education, jobs, mySkills: skillList };
	} catch (error) {
		console.error(error);
	}
};
