import { PUBLIC_API_URL } from '$env/static/public';
import type { Education, JobApplication, JobPosition } from '../../../../app';

export const load = async (event) => {
	const id = event.params.meetingId;
	const token = event.cookies.get('accessToken');

	console.log('meetingID', id);

	try {
		let interviewData;
		if (id) {
			const resInterview = await fetch(`${PUBLIC_API_URL}/interview/${id}`, {
				headers: {
					Authorization: 'Bearer ' + token
				}
			});
			interviewData = await resInterview.json();
		}
		const resEducation = await fetch(`${PUBLIC_API_URL}/education/my`, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		});
		const resJobs = await fetch(`${PUBLIC_API_URL}/job-positions/my`, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		});
		const resApplications = await fetch(`${PUBLIC_API_URL}/job-applications/my`, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		});

		const applications: JobApplication[] = await resApplications.json();
		const education: Education[] = await resEducation.json();
		const jobs: JobPosition[] = await resJobs.json();
		return { education, jobs, applications, id, interviewData };
	} catch (error) {
		console.error(error);
	}
};
