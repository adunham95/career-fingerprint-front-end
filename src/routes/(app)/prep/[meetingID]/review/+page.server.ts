import { PUBLIC_API_URL } from '$env/static/public';
import { error } from '@sveltejs/kit';
export const load = async (event) => {
	const meetingID = event.params.meetingID;
	const token = event.cookies.get('accessToken');

	console.log({ params: event.params });

	try {
		const res = await fetch(
			`${PUBLIC_API_URL}/meetings/${meetingID}?highlights=true&questions=true`,
			{
				headers: {
					Authorization: 'Bearer ' + token
				}
			}
		);

		console.log(res);

		if (!res) {
			error(404, {
				message: 'Not found'
			});
		}

		if (res.ok) {
			const meeting = await res.json();
			return { meeting, meetingID };
		}
	} catch (error) {
		console.error(error);
	}
};
