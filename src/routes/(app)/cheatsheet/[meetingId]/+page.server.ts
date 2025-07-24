import { PUBLIC_API_URL } from '$env/static/public';
import { useFeatureGate } from '$lib/Utils/featureGate';
import { redirect } from '@sveltejs/kit';
import type { Education, JobPosition } from '../../../../app';

export const load = async (event) => {
	const id = event.params.meetingId;
	const token = event.cookies.get('accessToken');

	const featureEnabled = useFeatureGate(1, event.locals.user);

	if (!featureEnabled) {
		redirect(307, '/settings/membership');
	}

	console.log(event);

	try {
		const resInterview = await fetch(`${PUBLIC_API_URL}/meetings/${id}`, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		});
		const interviewData = await resInterview.json();

		const resEducation = await fetch(`${PUBLIC_API_URL}/education/my`, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		});
		const resJobs = await fetch(`${PUBLIC_API_URL}/job-positions/my`, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		});

		const resRelatedNotes = await fetch(`${PUBLIC_API_URL}/notes/meeting/${id}`, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		});
		const resHighlights = await fetch(`${PUBLIC_API_URL}/highlights/meeting/${id}`, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		});

		const relatedNotes = await resRelatedNotes.json();
		const highlights = await resHighlights.json();
		const education: Education[] = await resEducation.json();
		const jobs: JobPosition[] = await resJobs.json();
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
