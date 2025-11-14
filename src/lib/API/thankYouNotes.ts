import { createMutation } from '@tanstack/svelte-query';
import { createApiClient } from './apiClient';

async function sendThankYouNote(data: {
	message: string;
	meetingID: string;
	contacts: { firstName: string; email: string }[];
}) {
	try {
		const api = createApiClient();
		const thankYou = await api.post('/thank-yous', data);
		return thankYou;
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to get resume`);
	}
}

// MUTATIONS

export const useAddThankYouMutation = () => {
	return createMutation({
		mutationFn: sendThankYouNote,
		onError: (error) => {
			console.error('Failed to send thank you note:', error);
		}
	});
};
