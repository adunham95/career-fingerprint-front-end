import { error } from '@sveltejs/kit';
import { createApiClient } from '$lib/API/apiClient.js';
export const load = async (event) => {
	const meetingID = event.params.meetingID;

	try {
		const api = createApiClient(event);
		const meeting = await api.get(`/meetings/${meetingID}`);

		if (!meeting) {
			error(404, {
				message: 'Not found'
			});
		}
		const questions = await api.get(`/prep/questions/meeting/${meetingID}`);

		return { meeting, meetingID, questions };
	} catch (error) {
		console.error(error);
	}
};
