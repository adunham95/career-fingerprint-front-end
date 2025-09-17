import { error } from '@sveltejs/kit';
import { createApiClient } from '$lib/API/apiClient.js';
export const load = async (event) => {
	const meetingID = event.params.meetingID;

	console.log({ params: event.params });

	try {
		const api = createApiClient(event);
		const meeting = await api.get(`/meetings/${meetingID}`);

		if (!meeting) {
			error(404, {
				message: 'Not found'
			});
		}

		const highlights = await api.get(`/highlights/meeting/${meetingID}`);
		const achievements = await api.get(`/achievement/my`);

		return { meeting, meetingID, achievements, highlights };
	} catch (error) {
		console.error(error);
	}
};
