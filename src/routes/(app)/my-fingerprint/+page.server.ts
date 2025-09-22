import { createApiClient } from '$lib/API/apiClient';
import type { Education, JobPosition } from '../../../app.js';

export const load = async (event) => {
	try {
		const api = createApiClient(event);

		const [education, jobs, skillList] = await Promise.all([
			await api.get<Education[]>('/education/my'),
			await api.get<JobPosition[]>('/job-positions/my'),
			await api.get('/skill-list/my')
		]);

		return { education, jobs, skillList };
	} catch (error) {
		console.error(error);
	}
};
