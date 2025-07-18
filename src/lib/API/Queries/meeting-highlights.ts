import { PUBLIC_API_URL } from '$env/static/public';

export const meetingHighlightsQueryKey = 'meetingHighlights';

export async function fetchMeetingHighlights(meetingID: string) {
	const resHighlights = await fetch(`${PUBLIC_API_URL}/highlights/meeting/${meetingID}`, {
		credentials: 'include'
	});

	return await resHighlights.json();
}
