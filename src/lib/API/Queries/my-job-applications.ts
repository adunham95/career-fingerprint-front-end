import { PUBLIC_API_URL } from '$env/static/public';

export const myJobApplicationsQueryKey = 'job-applications';

export async function fetchMyJobApplications() {
	const resEducation = await fetch(`${PUBLIC_API_URL}/job-applications/my`, {
		credentials: 'include'
	});
	return resEducation.json();
}
