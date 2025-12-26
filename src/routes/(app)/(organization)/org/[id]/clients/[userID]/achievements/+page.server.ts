import { createApiClient } from '$lib/API/apiClient';
import type { Achievement } from '../../../../../../../../app';

export const load = async (event) => {
	try {
		const api = createApiClient(event);

		const [achievements] = await Promise.all([
			await api.get<Achievement[]>(`/achievement/my/${event.params.userID}`, {
				includeLinked: true
			})
		]);

		return { achievements: achievements ?? [] };
	} catch (error) {
		console.error(error);
	}
};
