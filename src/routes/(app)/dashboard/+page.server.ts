import { PUBLIC_API_URL } from '$env/static/public';
import type { Achievement, Meeting } from '../../../app';

export const load = async (event) => {
	const token = event.cookies.get('accessToken');

	try {
		const resAchievements = await fetch(`${PUBLIC_API_URL}/achievement/my?page=1&limit=5`, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		});
		const resMeetings = await fetch(`${PUBLIC_API_URL}/meetings/my/upcoming?page=1&limit=3`, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		});

		const achievements: Achievement[] = await resAchievements.json();
		const meetings: Meeting[] = await resMeetings.json();
		return { achievements, meetings };
	} catch (error) {
		console.error(error);
	}
};
