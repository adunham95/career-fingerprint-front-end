import { createApiClient } from '$lib/API/apiClient';
import type { MyFingerprint } from '../../../../../../../app.js';

export const load = async (event) => {
	try {
		const api = createApiClient(event);

		const [myFingerprint] = await Promise.all([
			await api.get<MyFingerprint>('/my-fingerprint/user/2')
		]);

		return { myFingerprint };
	} catch (error) {
		console.error(error);
	}
};
