import { PUBLIC_API_URL } from '$env/static/public';
import { error } from '@sveltejs/kit';
import type { PrepQuestion } from '../../../../../app.js';
export const load = async (event) => {
	const meetingID = event.params.meetingID;
	const token = event.cookies.get('accessToken');

	console.log({ params: event.params });

	try {
		const res = await fetch(`${PUBLIC_API_URL}/meetings/${meetingID}`, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		});

		if (!res) {
			error(404, {
				message: 'Not found'
			});
		}

		const resQuestions = await fetch(`${PUBLIC_API_URL}/prep/questions/meeting/${meetingID}`, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		});

		const questions: PrepQuestion[] = await resQuestions.json();
		const meeting = await res.json();
		return { meeting, meetingID, questions };
	} catch (error) {
		console.error(error);
	}
};
