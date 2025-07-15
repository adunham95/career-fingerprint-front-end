import { PUBLIC_API_URL } from '$env/static/public';
import type { Education, JobApplication, JobPosition, Achievement } from '../../../../app';

export const load = async (event) => {
	const id = event.params.meetingId;
	const token = event.cookies.get('accessToken');

	console.log('meetingID', id);

	try {
		const resInterview = await fetch(`${PUBLIC_API_URL}/meetings/${id}`, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		});

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
		const resAch = await fetch(`${PUBLIC_API_URL}/achievement/my`, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		});

		const interviewData = await resInterview.json();
		const applications: JobApplication[] = await resApplications.json();
		const education: Education[] = await resEducation.json();
		const jobs: JobPosition[] = await resJobs.json();
		const achievements: Achievement[] = await resAch.json();
		return { education, jobs, applications, id, interviewData, meetingID: id, achievements };
	} catch (error) {
		console.error(error);
	}
};
