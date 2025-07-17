import { PUBLIC_API_URL } from '$env/static/public';
import type { Meeting } from '../../../app';

export interface CreateMeetingInput {
	time: Date | string | null;
	title: string | null;
	type: string | null;
	location: string | null;
	link: string | null;
	jobAppID?: string | null;
	jobPositionID?: string | null;
	educationID?: string | null;
}

export async function createMeeting(meeting: Partial<CreateMeetingInput>): Promise<Meeting | null> {
	console.info('createMeeting', meeting);
	const url = `${PUBLIC_API_URL}/meetings`;

	try {
		const res = await fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(meeting)
		});

		if (res.ok) {
			return await res.json();
		} else {
			const message = await res.text();
			throw new Error(`Failed to patch meeting: ${res.status} ${message}`);
		}
	} catch (error) {
		console.log(error);
		return null;
	}
}
