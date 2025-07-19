import { PUBLIC_API_URL } from '$env/static/public';

export const load = async (event) => {
	const id = event.params.meetingId;
	const token = event.cookies.get('accessToken');

	console.log('meetingID', id);

	try {
		const resInterview = await fetch(`${PUBLIC_API_URL}/meetings/${id}`, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		});
		const meeting = await resInterview.json();

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
