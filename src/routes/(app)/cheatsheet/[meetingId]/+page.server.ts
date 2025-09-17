import { useFeatureGate } from '$lib/Utils/featureGate';
import { redirect } from '@sveltejs/kit';
import type { Education, JobPosition, Meeting, MeetingHighlight } from '../../../../app';
import { createApiClient } from '$lib/API/apiClient';

export const load = async (event) => {
	const id = event.params.meetingId;

	const featureEnabled = useFeatureGate(1, event.locals.user);

	if (!featureEnabled) {
		redirect(307, '/settings/membership');
	}

	try {
		const api = createApiClient(event);
		const interviewData = await api.get<Meeting>(`/meetings/${id}`);
		const relatedNotes = await api.get(`/notes/meeting/${id}`);
		const highlights = await api.get<MeetingHighlight[]>(`/highlights/meeting/${id}`);
		const education: Education[] = await api.get('/education/my');
		const jobs: JobPosition[] = await api.get('/job-positions/my');
		return {
			education,
			jobs,
			id,
			interviewData,
			meetingID: id,
			relatedNotes,
			highlights,
			featureEnabled
		};
	} catch (error) {
		console.error(error);
	}
};
