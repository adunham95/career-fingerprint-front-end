import { createApiClient } from '$lib/API/apiClient';
import type { JobApplication } from '../../../../app';

export const load = async (event) => {
	const id = event.params.id;

	try {
		const api = createApiClient(event);
		const application = await api.get<JobApplication>(`/job-applications/${id}`);
		return { application };
	} catch (error) {
		console.error(error);
	}
};
