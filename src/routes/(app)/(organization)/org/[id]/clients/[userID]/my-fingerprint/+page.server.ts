import { createApiClient } from '$lib/API/apiClient';
import type { MyFingerprint } from '../../../../../../../../app';

export const load = async (event) => {
	try {
		const api = createApiClient(event);

		const [myFingerprint] = await Promise.all([
			await api.get<MyFingerprint>(`/my-fingerprint/client/${event.params.userID}`)
		]);

		return { myFingerprint };
	} catch (error) {
		console.error(error);
	}
};
