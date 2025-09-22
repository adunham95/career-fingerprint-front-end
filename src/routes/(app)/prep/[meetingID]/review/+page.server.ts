import { createApiClient } from '$lib/API/apiClient.js';
import { error } from '@sveltejs/kit';
import type { Meeting, PrepAnswer } from '../../../../../app.js';
export const load = async (event) => {
	const meetingID = event.params.meetingID;

	console.log({ params: event.params });

	try {
		const api = createApiClient(event);
		const meeting = await api.get<Meeting>(`/meetings/${meetingID}`, {
			highlights: true,
			questions: true
		});

		if (!meeting) {
			error(404, {
				message: 'Not found'
			});
		}
		const prepAnswers = await api.get<PrepAnswer[]>(`/prep/answers/meeting/${meetingID}`);

		return { meeting, meetingID, prepAnswers: prepAnswers ?? [] };
	} catch (error) {
		console.error(error);
	}
};
