import { PUBLIC_API_URL } from '$env/static/public';
import { error } from '@sveltejs/kit';
import type { Achievement } from '../../../../../app.js';
export const load = async (event) => {
	const meetingID = event.params.meetingID;
	const token = event.cookies.get('accessToken');

	console.log({ params: event.params });

	try {
		const resMeeting = await fetch(`${PUBLIC_API_URL}/meetings/${meetingID}`, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		});

		if (!resMeeting) {
			error(404, {
				message: 'Not found'
			});
		}

		const resAch = await fetch(`${PUBLIC_API_URL}/achievement/my`, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		});

		const meeting = await resMeeting.json();
		const achievements: Achievement[] = await resAch.json();

		return { meeting, meetingID, achievements };
	} catch (error) {
		console.error(error);
	}
};
