import { createApiClient } from '$lib/API/apiClient.js';
import type { Meeting } from '../../../../../app.js';

export const load = async (event) => {
	const id = event.params.id;

	try {
		const api = createApiClient();
		const meetings = await api.get<Meeting[]>(`/meetings/job-application/${id}`);

		return { meetings };
	} catch (error) {
		console.error(error);
	}
};
