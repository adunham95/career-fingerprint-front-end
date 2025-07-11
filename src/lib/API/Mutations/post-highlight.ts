import { PUBLIC_API_URL } from '$env/static/public';

export interface NewHighlight {
	meetingID: string;
	text: string;
	note?: string | null;
	achievements: string[];
}

export interface PostHighlightResponse {
	id: string;
	createdAt: string;
	updatedAt: string;
	userID: number;
	text: string;
	meetingID: string;
}

export async function postHighlight(
	highlight: NewHighlight
): Promise<PostHighlightResponse | null> {
	console.info('postHighlight', highlight);
	const url = `${PUBLIC_API_URL}/highlights`;

	try {
		const res = await fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(highlight)
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
