import { createMutation } from '@tanstack/svelte-query';
import { createApiClient } from './apiClient';

export async function loginOrgAdmin({ id }: { id: string }) {
	try {
		const api = createApiClient();
		return api.post(`/auth/login/org/${id}`, {});
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to login to org`);
	}
}

export const useLoginOrgAdminMutation = () => {
	return createMutation({
		mutationFn: loginOrgAdmin,
		onSuccess: () => {},
		onError: (error) => {
			console.error('Failed to create achievement tag:', error);
		}
	});
};
