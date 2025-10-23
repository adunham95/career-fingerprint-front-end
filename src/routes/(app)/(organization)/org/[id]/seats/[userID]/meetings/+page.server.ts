import { createApiClient } from '$lib/API/apiClient';
import type { Meeting } from '../../../../../../../../app';

export const load = async (event) => {
	try {
		const api = createApiClient(event);

		const [meetings] = await Promise.all([
			await api.get<Meeting[]>(`/meetings/my/${event.params.userID}`)
		]);

		return { meetings: meetings ?? [] };
	} catch (error) {
		console.error(error);
	}
};
