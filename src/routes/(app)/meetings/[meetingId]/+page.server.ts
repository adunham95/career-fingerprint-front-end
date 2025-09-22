import { createApiClient } from '$lib/API/apiClient.js';
import type { Meeting, MeetingHighlight } from '../../../../app.js';

export const load = async (event) => {
	const id = event.params.meetingId;

	console.log('meetingID', id);

	try {
		const api = createApiClient(event);

		const [meeting, relatedNotes, highlights] = await Promise.all([
			await api.get<Meeting>(`/meetings/${id}`),
			await api.get(`/notes/meeting/${id}`),
			await api.get<MeetingHighlight[]>(`/highlights/meeting/${id}`)
		]);

		return {
			id,
			meeting,
			meetingID: id,
			relatedNotes,
			highlights
		};
	} catch (error) {
		console.error(error);
	}
};
