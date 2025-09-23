import { createApiClient } from '$lib/API/apiClient.js';
import type { Resume } from '../../../app.js';
export const load = async (event) => {
	try {
		const api = createApiClient(event);
		const resumes = await api.get<Resume>('/resume/my');

		return { resumes };
	} catch (error) {
		console.error(error);
	}
};
