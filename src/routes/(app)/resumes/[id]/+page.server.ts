import { createApiClient } from '$lib/API/apiClient';
import type { Education, JobPosition, Resume } from '../../../../app';

export const load = async (event) => {
	console.log(event.params.id);

	try {
		const api = createApiClient(event);
		const [resume, education, jobs, skillList] = await Promise.all([
			await api.get<Resume>(`/resume/${event.params.id}`),
			await api.get<Education[]>('/education/my'),
			await api.get<JobPosition[]>('/job-positions/my'),
			await api.get('/skill-list/my')
		]);
		return { resume, education, jobs, mySkills: skillList };
	} catch (error) {
		console.error(error);
	}
};
