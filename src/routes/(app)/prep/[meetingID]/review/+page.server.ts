import { createApiClient } from '$lib/API/apiClient.js';
import { error } from '@sveltejs/kit';
export const load = async (event) => {
	const meetingID = event.params.meetingID;

	console.log({ params: event.params });

	try {
		const api = createApiClient(event);
		const meeting = await api.get(`/meetings/${meetingID}`, { highlights: true, questions: true });
		const prepAnswers = await api.get(`/prep/answers/meeting/${meetingID}`);

		if (!meeting) {
			error(404, {
				message: 'Not found'
			});
		}

		return { meeting, meetingID, prepAnswers };
	} catch (error) {
		console.error(error);
	}
};
