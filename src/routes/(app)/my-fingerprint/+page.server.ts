import { createApiClient } from '$lib/API/apiClient';
import type { Education, JobPosition } from '../../../app.js';

export const load = async (event) => {
	console.log(event.cookies);
	try {
		const api = createApiClient(event);
		const education = await api.get<Education[]>('/education/my');
		const jobs = await api.get<JobPosition[]>('/job-positions/my');
		const skillList = await api.get('/skill-list/my');

		return { education, jobs, skillList };
	} catch (error) {
		console.error(error);
	}
};
