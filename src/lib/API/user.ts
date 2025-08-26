import { PUBLIC_API_URL } from '$env/static/public';
import { createMutation, createQuery } from '@tanstack/svelte-query';
import type { CurrentUser } from '../../app';

export interface RegisteredUserData {
	accessToken: string;
	user: {
		id: number;
		firstName: string;
		lastName: string;
		profileImage: string;
		email: string;
		orgID: null;
	};
	plan: {
		id: string;
		key: string;
		level: number;
		name: string;
		description: string;
		featureList: string[];
		priceCents: number;
		priceCentsYear: number;
		interval: string;
		monthlyStripePriceID: string;
		annualStripePriceID: string;
	};
	orgName?: string;
	orgID?: string;
}

export async function registerUser(newProfile: {
	lookingFor: string;
	firstName: string;
	companyName: string;
	title: string;
	institution: string;
	degree: string;
	startDate: string;
	endDate: string;
	email: string;
	password: string;
	achievement: string;
}): Promise<RegisteredUserData> {
	const url = `${PUBLIC_API_URL}/register`;

	try {
		const res = await fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json' // Set content type to JSON
			},
			body: JSON.stringify({
				...newProfile,
				startDate: newProfile.startDate ? new Date(newProfile.startDate).toISOString() : '',
				endDate: newProfile.endDate ? new Date(newProfile.endDate).toISOString() : ''
			})
		});
		if (res.ok) {
			return await res.json();
		} else {
			const message = await res.text();
			throw new Error(`Failed to register user ${res.status} ${message}`);
		}
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to register user`);
	}
}

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

export async function inviteStats(): Promise<{ totalInvited: number } | null> {
	const url = `${PUBLIC_API_URL}/users/invite-stats`;

	try {
		const res = await fetch(url, {
			method: 'GET',
			credentials: 'include'
		});

		if (res.ok) {
			return await res.json();
		} else {
			const message = await res.text();
			throw new Error(`Failed to get invite code stats: ${res.status} ${message}`);
		}
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to get invite code stats`);
	}
}

export async function currentUser(): Promise<CurrentUser | null> {
	const url = `${PUBLIC_API_URL}/auth/current-user`;

	try {
		const res = await fetch(url, {
			method: 'GET',
			credentials: 'include'
		});

		if (res.ok) {
			return await res.json();
		} else {
			const message = await res.text();
			throw new Error(`Failed to get current user: ${res.status} ${message}`);
		}
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to get current user`);
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

export const useRegisterUserMutation = () => {
	return createMutation({
		mutationFn: registerUser,
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

// Queries

export const useGetInviteStats = () => {
	return createQuery({
		queryKey: ['invite-stats'],
		queryFn: inviteStats
	});
};

export const useGetCurrentUser = () => {
	return createQuery({
		queryKey: ['current-user'],
		queryFn: currentUser
	});
};
