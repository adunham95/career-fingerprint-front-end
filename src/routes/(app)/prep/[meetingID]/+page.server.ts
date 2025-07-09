import { PUBLIC_API_URL } from '$env/static/public';
import { error } from '@sveltejs/kit';
export const load = async (event) => {
	const meetingID = event.params.meetingID;
	const token = event.cookies.get('accessToken');

	try {
		const res = await fetch(`${PUBLIC_API_URL}/meetings/${meetingID}`, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		});

		if (!res) {
			error(404, {
				message: 'Not found'
			});
		}
		const meeting = await res.json();

		return { meeting, meetingID };
	} catch (error) {
		console.error(error);
	}
};
