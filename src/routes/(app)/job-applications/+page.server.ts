import { createApiClient } from '$lib/API/apiClient.js';
import type { JobApplication } from '../../../app.js';

export const load = async (event) => {
	try {
		const api = createApiClient(event);
		const applications = await api.get<JobApplication[]>('/job-applications/my');
		return { applications };
	} catch (error) {
		console.error(error);
	}
};
