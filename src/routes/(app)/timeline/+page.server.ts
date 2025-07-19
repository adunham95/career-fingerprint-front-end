import { PUBLIC_API_URL } from '$env/static/public';
import type { Achievement } from '../../../app';

export const load = async (event) => {
	const token = event.cookies.get('accessToken');

	try {
		const resAchievements = await fetch(`${PUBLIC_API_URL}/achievement/my`, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		});
		const achievements: Achievement[] = await resAchievements.json();
		return { achievements };
	} catch (error) {
		console.error(error);
	}
};
