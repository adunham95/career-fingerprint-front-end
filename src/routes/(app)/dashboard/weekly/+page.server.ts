import { PUBLIC_API_URL } from '$env/static/public';
import type { Meeting } from '../../../../app';

export const load = async (event) => {
	const token = event.cookies.get('accessToken');

	try {
		const resMeetings = await fetch(`${PUBLIC_API_URL}/meetings/my/upcoming?page=1&limit=3`, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		});
		const meetings: Meeting[] = await resMeetings.json();
		return { meetings };
	} catch (error) {
		console.error(error);
	}
};
