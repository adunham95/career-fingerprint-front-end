import { PUBLIC_API_URL } from '$env/static/public';

export interface NewPrepAnswer {
	answer: string;
	jobApplicationID?: string;
	questionID: string;
	meetingID?: string;
}

export async function upsertPrepAnswer(
	prepAnswer: NewPrepAnswer
): Promise<{ success: boolean } | null> {
	console.info(prepAnswer);
	const url = `${PUBLIC_API_URL}/prep/answer`;

	try {
		const res = await fetch(url, {
			method: 'PATCH',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(prepAnswer)
		});

		if (res.ok) {
			return { success: true };
		} else {
			const message = await res.text();
			throw new Error(`Failed to patch job application: ${res.status} ${message}`);
		}
	} catch (error) {
		console.log(error);
		return { success: false };
	}
}
