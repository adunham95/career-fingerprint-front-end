import { createApiClient } from '$lib/API/apiClient.js';
import type { CoverLetter } from '$lib/API/cover-letters.js';

export const load = async (event) => {
	const id = event.params.id;

	try {
		const api = createApiClient(event);
		const coverLetter = await api.get<CoverLetter>(`/cover-letters/jobApp/${id}`);
		return { coverLetter };
	} catch (error) {
		console.error(error);
	}
};
