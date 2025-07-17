import { PUBLIC_API_URL } from '$env/static/public';
import type { Meeting } from '../../../app';

export interface UpdateMeetingInput {
	id: string;
	time: Date | string | null;
	title: string | null;
	type: string | null;
	location: string | null;
	link: string | null;
	jobAppID?: string | null;
	jobPositionID?: string | null;
	educationID?: string | null;
}

export async function updateMeeting(meeting: Partial<UpdateMeetingInput>): Promise<Meeting | null> {
	console.info('updateMeeting', meeting);
	const url = `${PUBLIC_API_URL}/meetings/${meeting.id}`;

	try {
		const res = await fetch(url, {
			method: 'PATCH',
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
