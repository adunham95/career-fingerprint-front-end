import { PUBLIC_API_URL } from '$env/static/public';
import { redirect, error } from '@sveltejs/kit';

export const load = async (event) => {
	const token = event.cookies.get('accessToken');
	const meetingType = event.url.searchParams.get('meeting-type');

	let meetingID = null;

	try {
		const resMeeting = await event.fetch(`${PUBLIC_API_URL}/meetings`, {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json' // Set content type to JSON
			},
			body: JSON.stringify({
				type: meetingType,
				time: new Date().toDateString()
			})
		});

		if (!resMeeting.ok) {
			throw new Error('Failed to create meeting');
		}
		const meeting = await resMeeting.json();

		meetingID = meeting.id;

		if (!meetingID) {
			throw new Error('Missing meeting ID in response');
		}
	} catch (err) {
		console.log({ err });
		error(404, 'Error ');
	}

	redirect(302, `/cheatsheet/${meetingID}`);
};
