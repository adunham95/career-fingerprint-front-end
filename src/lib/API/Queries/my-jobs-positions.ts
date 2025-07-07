import { PUBLIC_API_URL } from '$env/static/public';

export const myJobPositionsQueryKey = 'job-positions';

export async function fetchMyJobPositions() {
	const resJobs = await fetch(`${PUBLIC_API_URL}/job-positions/my`, {
		credentials: 'include'
	});
	return resJobs.json();
}
