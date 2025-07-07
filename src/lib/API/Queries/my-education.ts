import { PUBLIC_API_URL } from '$env/static/public';

export const myEducationQueryKey = 'education';

export async function fetchMyEducation() {
	const resEducation = await fetch(`${PUBLIC_API_URL}/education/my`, {
		credentials: 'include'
	});
	return resEducation.json();
}
