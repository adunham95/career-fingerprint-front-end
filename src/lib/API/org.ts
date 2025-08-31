import { PUBLIC_API_URL } from '$env/static/public';
import { createMutation, createQuery } from '@tanstack/svelte-query';

export async function registerOrg(newProfile: {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	orgName: string;
	orgSize: number;
	orgDomain: string;
	orgEmail: string;
}) {
	const url = `${PUBLIC_API_URL}/register/org`;

	try {
		const res = await fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json' // Set content type to JSON
			},
			body: JSON.stringify(newProfile)
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

export async function getOrgUsers(orgID: string, page = 1, size = 20) {
	try {
		const res = await fetch(`${PUBLIC_API_URL}/org/${orgID}/users?page=${page}&pageSize=${size}`, {
			credentials: 'include'
		});
		return res.json();
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function removeUserFromOrg({ userID, orgID }: { userID: number; orgID: string }) {
	try {
		const res = await fetch(`${PUBLIC_API_URL}/org/${orgID}/user/${userID}`, {
			method: 'DELETE',
			credentials: 'include'
		});
		return res.json();
	} catch (error) {
		console.error(error);
		return null;
	}
}

export const orgKeys = {
	orgUsers: (id: string, page = 1, pageSize = 20) => ['orgUsers', id, page, pageSize] as const
};

// QUERIES

export const useOrgUsersByPageQuery = (orgID: string, page: () => number, size = 20) => {
	return createQuery({
		queryKey: orgKeys.orgUsers(orgID, page(), size),
		queryFn: () => getOrgUsers(orgID, page(), size)
	});
};

// MUTATIONS

export const useRegisterOrg = () => {
	return createMutation({
		mutationFn: registerOrg,
		onSuccess: () => {},
		onError: (error) => {
			console.error('Failed to create subscription:', error);
		}
	});
};

export const useRemoveUserFromOrg = () => {
	return createMutation({
		mutationFn: removeUserFromOrg,
		onSuccess: () => {},
		onError: (error) => {
			console.error('Failed to create subscription:', error);
		}
	});
};
