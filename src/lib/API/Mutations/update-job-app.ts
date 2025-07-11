import { PUBLIC_API_URL } from '$env/static/public';
import type { JobApplication } from '../../../app';

export async function patchJobApp(jobApp: Partial<JobApplication>): Promise<JobApplication | null> {
	console.info('patchJobApp', jobApp);
	const url = `${PUBLIC_API_URL}/job-applications/${jobApp.id}`;

	try {
		const res = await fetch(url, {
			method: 'PATCH',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(jobApp)
		});

		if (res.ok) {
			return await res.json();
		} else {
			const message = await res.text();
			throw new Error(`Failed to patch job application: ${res.status} ${message}`);
		}
	} catch (error) {
		console.log(error);
		return null;
	}
}
