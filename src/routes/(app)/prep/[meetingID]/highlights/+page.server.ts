import { error } from '@sveltejs/kit';
import { createApiClient } from '$lib/API/apiClient.js';
export const load = async (event) => {
	const meetingID = event.params.meetingID;

	console.log({ params: event.params });

	try {
		const api = createApiClient(event);
		const meeting = await api.get(`/meetings/${meetingID}`);
		if (!meeting) {
			throw error(404, { message: 'Meeting not found' });
		}

		const [highlights, achievements] = await Promise.all([
			api.get(`/highlights/meeting/${meetingID}`),
			api.get(`/achievement/my`) // limit avoids pulling too much
		]);

		return { meeting, meetingID, achievements, highlights };
	} catch (error) {
		console.error(error);
	}
};
