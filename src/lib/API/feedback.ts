import { PUBLIC_API_URL } from '$env/static/public';
import { createMutation } from '@tanstack/svelte-query';

interface NewFeedback {
	userID: number;
	feedback: string;
	page: string;
	device: string;
	rating: number;
	contact: boolean;
}

export async function createNewFeedback(
	newFeedback: NewFeedback
): Promise<{ success: boolean } | null> {
	const url = `${PUBLIC_API_URL}/feedback`;

	try {
		const res = await fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newFeedback)
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

export const useCreateFeedbackMutation = () => {
	return createMutation({
		mutationFn: createNewFeedback,
		onSuccess: () => {},
		onError: (error) => {
			console.error('Failed to create highlight:', error);
		}
	});
};
