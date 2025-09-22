import { createApiClient } from '$lib/API/apiClient.js';
import { error } from '@sveltejs/kit';
import type { Meeting } from '../../../../app.js';
export const load = async (event) => {
	const meetingID = event.params.meetingID;

	try {
		const api = createApiClient(event);
		const meeting = await api.get<Meeting>(`/meetings/${meetingID}`);
		if (!meeting) {
			error(404, {
				message: 'Not found'
			});
		}

		return { meeting, meetingID };
	} catch (error) {
		console.error(error);
	}
};
