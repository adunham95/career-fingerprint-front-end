import { createMutation } from '@tanstack/svelte-query';
import { createApiClient } from './apiClient';

export async function inviteUser(data: {
	firstName: string;
	email: string;
	message?: string;
}): Promise<null> {
	try {
		const api = createApiClient();
		return api.post(`/client/invite`, data);
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to invite client`);
	}
}

// MUTATIONS
export const useCreateClientInvite = () => {
	return createMutation({
		mutationFn: inviteUser,
		onSuccess: () => {},
		onError: (error) => {
			console.error('Failed to invite client:', error);
		}
	});
};
