import { PUBLIC_API_URL } from '$env/static/public';
import { createMutation } from '@tanstack/svelte-query';

export async function deleteUser(): Promise<{ success: boolean } | null> {
	const url = `${PUBLIC_API_URL}/users/1`;

	try {
		const res = await fetch(url, {
			method: 'DELETE',
			credentials: 'include'
		});

		if (res.ok) {
			return await res.json();
		} else {
			const message = await res.text();
			throw new Error(`Failed to delete user: ${res.status} ${message}`);
		}
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to delete user`);
	}
}

export async function generateInviteCode(): Promise<string | null> {
	const url = `${PUBLIC_API_URL}/users/new-invite-code`;

	try {
		const res = await fetch(url, {
			method: 'GET',
			credentials: 'include'
		});

		if (res.ok) {
			return await res.text();
		} else {
			const message = await res.text();
			throw new Error(`Failed to get new invite code: ${res.status} ${message}`);
		}
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to get new invite code`);
	}
}

export const userKeys = {
	inviteCode: ['invite-code'] as const
};

export const useDeleteUserMutation = () => {
	return createMutation({
		mutationFn: deleteUser,
		onSuccess: () => {},
		onError: (error) => {
			console.error('Failed to delete user:', error);
		}
	});
};

export const useNewInviteCodeQuery = () => {
	return createMutation({
		mutationFn: generateInviteCode
	});
};
