import { error } from '@sveltejs/kit';
import { createApiClient } from '$lib/API/apiClient.js';
import type { Achievement, Meeting, MeetingHighlight } from '../../../../../app.js';
export const load = async (event) => {
	const meetingID = event.params.meetingID;

	console.log({ params: event.params });

	try {
		const api = createApiClient(event);
		const meeting = await api.get<Meeting>(`/meetings/${meetingID}`);
		if (!meeting) {
			throw error(404, { message: 'Meeting not found' });
		}

		const [highlights, achievements] = await Promise.all([
			api.get<MeetingHighlight[]>(`/highlights/meeting/${meetingID}`),
			api.get<Achievement[]>(`/achievement/my`)
		]);

		return { meeting, meetingID, achievements: achievements ?? [], highlights: highlights ?? [] };
	} catch (error) {
		console.error(error);
	}
};
