import { useFeatureGate } from '$lib/Utils/featureGate';
import { redirect } from '@sveltejs/kit';
import type {
	Education,
	JobPosition,
	Meeting,
	MeetingHighlight,
	PrepAnswer
} from '../../../../app';
import { createApiClient } from '$lib/API/apiClient';

export const load = async (event) => {
	const id = event.params.meetingId;
	const { user } = await event.parent();
	const featureEnabled = useFeatureGate(2, user);

	if (!featureEnabled) {
		redirect(307, '/settings/membership');
	}

	try {
		const api = createApiClient(event);
		const [interviewData, relatedNotes, highlights, education, jobs, questions] = await Promise.all(
			[
				await api.get<Meeting>(`/meetings/${id}`),
				await api.get(`/notes/meeting/${id}`),
				await api.get<MeetingHighlight[]>(`/highlights/meeting/${id}`),
				await api.get<Education[]>('/education/my'),
				await api.get<JobPosition[]>('/job-positions/my'),
				await api.get<PrepAnswer[]>(`/prep/answers/meeting/${id}`)
			]
		);
		return {
			education,
			jobs,
			id,
			interviewData,
			questions,
			meetingID: id,
			relatedNotes,
			highlights,
			featureEnabled
		};
	} catch (error) {
		console.error(error);
	}
};
