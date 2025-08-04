import { getUpcomingMeeting } from '$lib/API/meeting';

export const load = async (event) => {
	const token = event.cookies.get('accessToken');

	try {
		const meetings = await getUpcomingMeeting(token);
		return { meetings };
	} catch (error) {
		console.error(error);
	}
};
