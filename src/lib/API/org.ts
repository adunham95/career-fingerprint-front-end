import { PUBLIC_API_URL } from '$env/static/public';
import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
import { queryClient } from './queryClient';
import { createApiClient } from './apiClient';
import type { Organization, OrgUser } from '../../app';

export async function registerOrg(newProfile: {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	orgName: string;
	orgSize?: number;
	orgDomain?: string;
	orgEmail: string;
	postalCode?: string;
	country?: string;
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

export async function createOrg(newOrg: {
	orgName: string;
	orgDomain: string;
	orgEmail: string;
	orgLogo: string;
	admin: number;
	postalCode: string;
	country: string;
}) {
	try {
		const api = createApiClient();
		await api.post('/org', newOrg);
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to register org`);
	}
}

export async function updateOrg(data: {
	id: string;
	name?: string;
	domain?: string;
	logoURL?: string;
}) {
	const url = `${PUBLIC_API_URL}/org/${data.id}`;

	try {
		const res = await fetch(url, {
			method: 'PATCH',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json' // Set content type to JSON
			},
			body: JSON.stringify(data)
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

interface OrgUsersPage {
	users: OrgUser[];
	totalCount: number;
	totalPages: number;
	page: number;
	pageSize: number;
}

export async function getOrgUsers(
	orgID: string,
	page = 1,
	pageSize = 20
): Promise<OrgUsersPage | null> {
	try {
		const api = createApiClient();
		return api.get(`/org/${orgID}/users`, { page, pageSize });
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function getOrgAdmins(orgID: string): Promise<OrgUser[]> {
	try {
		const res = await fetch(`${PUBLIC_API_URL}/org/${orgID}/admins`, {
			credentials: 'include'
		});
		return res.json();
	} catch (error) {
		console.error(error);
		return [];
	}
}

export async function getOrgRoles(
	orgID: string
): Promise<{ id: string; label: string; description: string }[]> {
	try {
		const api = createApiClient();
		return api.get(`/org/${orgID}/roles`);
	} catch (error) {
		console.error(error);
		return [];
	}
}

export async function getOrg(orgID?: string) {
	try {
		if (!orgID) {
			throw Error('Missing OrgID');
		}
		const res = await fetch(`${PUBLIC_API_URL}/org/${orgID}`, {
			credentials: 'include'
		});
		return res.json();
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function removeUserFromOrg({ orgUserID }: { orgUserID: string }) {
	try {
		const api = createApiClient();
		return api.del(`/org-users/${orgUserID}`);
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function removeAdminFromOrg({ userID, orgID }: { userID: number; orgID: string }) {
	try {
		const api = createApiClient();
		return api.del(`/org/${orgID}/admin/${userID}`);
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function deleteDomain({ id }: { id: string }) {
	try {
		const res = await fetch(`${PUBLIC_API_URL}/domain/${id}`, {
			method: 'DELETE',
			credentials: 'include'
		});
		return res.json();
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function createAdmin(newUser: {
	firstName: string;
	lastName: string;
	email: string;
	orgID: string;
	roles: string[];
}) {
	try {
		const api = createApiClient();
		return api.post(`/org-users/admin`, newUser);
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function createOrgClient(data: {
	firstName: string;
	lastName: string;
	email: string;
	orgID: string;
}) {
	try {
		const api = createApiClient();
		return api.post(`/client`, data);
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function createOrgMember(data: {
	firstName: string;
	lastName: string;
	email: string;
}) {
	try {
		const api = createApiClient();
		return api.post(`/org-users/member`, data);
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function updateAdmin(data: { orgID: string; userID: number; role: string }) {
	try {
		const { orgID, userID, role } = data;
		const api = createApiClient();
		return api.patch(`/org/${orgID}/admin/${userID}`, { roles: [role] });
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function updateOrgUser(data: { orgUserID: string; roles: string[] }) {
	try {
		const { orgUserID, ...userData } = data;
		const api = createApiClient();
		return api.patch(`/org-users/${orgUserID}`, userData);
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function createDomain({ orgID, domain }: { orgID: string; domain: string }) {
	try {
		const res = await fetch(`${PUBLIC_API_URL}/domain`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json' // Set content type to JSON
			},
			body: JSON.stringify({ orgID, domain })
		});
		return res.json();
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function updateOrgSubscription({
	userCount,
	stripeSubscriptionID,
	subscriptionType,
	id
}: {
	id: string;
	userCount: number;
	stripeSubscriptionID: string;
	subscriptionType: string;
}) {
	try {
		const apiClient = createApiClient();
		apiClient.patch(`/org/${id}/add-subscription`, {
			userCount,
			subscriptionType,
			stripeSubscriptionID
		});
	} catch (error) {
		console.error(error);
		throw new Error(`Failed to create organization`);
	}
}

export async function updateDomain({
	id,
	orgID,
	domain
}: {
	id: string;
	orgID: string;
	domain: string;
}) {
	try {
		const res = await fetch(`${PUBLIC_API_URL}/domain/${id}`, {
			method: 'PATCH',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json' // Set content type to JSON
			},
			body: JSON.stringify({ orgID, domain })
		});
		return res.json();
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function getOrgDomains(orgID: string) {
	try {
		const res = await fetch(`${PUBLIC_API_URL}/domain/org/${orgID}`, {
			credentials: 'include'
		});
		return res.json();
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function getMyOrgs() {
	try {
		const api = createApiClient();
		return api.get<Organization[]>('/org/my');
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function getOrgPromoCode(orgID: string) {
	try {
		const api = createApiClient();
		return api.get<{ id: string; code: string } | null>(`/org/${orgID}/coupon`);
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function createPromoCode(data: { orgID: string; promoCodeText?: string }) {
	try {
		const api = createApiClient();
		return api.post<{ id: string; code: string } | null>(`/stripe/create-promo-code`, data);
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function verifyJoinCode(data: { joinCode: string }) {
	try {
		const api = createApiClient();
		return api.get<{ valid: boolean; org?: Organization; message: string } | null>(
			`/org-users/join/${data.joinCode}`
		);
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function joinOrgViaJoinCode(data: { joinCode: string }) {
	try {
		const api = createApiClient();
		return api.post<{ success: boolean; message: string } | null>(
			`/org-users/join/${data.joinCode}`
		);
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function getOrgConnections() {
	try {
		const api = createApiClient();
		return api.get<OrgUser[]>(`/org-users/connections`);
	} catch (error) {
		console.error(error);
		return null;
	}
}

export const orgKeys = {
	orgs: ['orgs'] as const,
	org: (id: string) => ['org', id] as const,
	orgAdmins: (id: string) => ['orgAdmins', id] as const,
	orgUsers: (id: string, page = 1, pageSize = 20) => ['orgUsers', id, page, pageSize] as const,
	orgDomains: (id: string) => ['orgDomains', id] as const,
	orgRoles: (id: string) => ['orgRoles', id] as const,
	orgPromoCodes: (id: string) => ['promoCodes', id] as const,
	orgConnections: ['orgConnections'] as const
};

// QUERIES

export const useOrgUsersByPageQuery = (orgID: string, page: () => number, size = 20) => {
	return createQuery({
		queryKey: orgKeys.orgUsers(orgID, page(), size),
		queryFn: () => getOrgUsers(orgID, page(), size)
	});
};

export const useMyOrgs = () => {
	return createQuery({
		queryKey: orgKeys.orgs,
		queryFn: () => getMyOrgs()
	});
};

export const useOrgAdmins = (orgID: string) => {
	return createQuery({
		queryKey: orgKeys.orgAdmins(orgID),
		queryFn: () => getOrgAdmins(orgID)
	});
};

export const useOrgDomains = (
	orgID: string,
	initialData?: { id: string; orgID: string; domain: string }[]
) => {
	return createQuery({
		queryKey: orgKeys.orgDomains(orgID),
		queryFn: () => getOrgDomains(orgID),
		initialData
	});
};

export const useOrg = (orgID?: string) => {
	return createQuery({
		queryKey: orgKeys.org(orgID || ''),
		queryFn: () => getOrg(orgID),
		enabled: !!orgID
	});
};

export const useOrgRoles = (orgID?: string) => {
	return createQuery({
		queryKey: orgKeys.orgRoles(orgID || ''),
		queryFn: () => getOrgRoles(orgID || ''),
		enabled: !!orgID
	});
};

export const useOrgPromoCode = (orgID?: string) => {
	return createQuery({
		queryKey: orgKeys.orgPromoCodes(orgID || ''),
		queryFn: () => getOrgPromoCode(orgID || ''),
		enabled: !!orgID
	});
};

export const useOrgConnections = () => {
	return createQuery({
		queryKey: orgKeys.orgConnections,
		queryFn: () => getOrgConnections()
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
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: removeUserFromOrg,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['orgUsers'],
				refetchType: 'all'
			});
			queryClient.invalidateQueries({
				queryKey: orgKeys.orgConnections
			});
		},
		onError: (error) => {
			console.error('Failed to create subscription:', error);
		}
	});
};

export const useRemoveAdminFromOrg = () => {
	return createMutation({
		mutationFn: removeAdminFromOrg,
		onSuccess: () => {},
		onError: (error) => {
			console.error('Failed to create subscription:', error);
		}
	});
};

export const useUpdateOrg = () => {
	return createMutation({
		mutationFn: updateOrg,
		onSuccess: () => {},
		onError: (error) => {
			console.error('Failed to create subscription:', error);
		}
	});
};

export const useCreateDomain = (orgID: string) => {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: createDomain,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: orgKeys.orgDomains(orgID)
			});
		},
		onError: (error) => {
			console.error('Failed to create domain:', error);
		}
	});
};

export const useUpdateDomain = (orgID: string) => {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: updateDomain,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: orgKeys.orgDomains(orgID)
			});
		},
		onError: (error) => {
			console.error('Failed to update domain:', error);
		}
	});
};

export const useDeleteDomain = (orgID: string) => {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: deleteDomain,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: orgKeys.orgDomains(orgID)
			});
		},
		onError: (error) => {
			console.error('Failed to delete domain:', error);
		}
	});
};

export const useAddAdmin = () => {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: createAdmin,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['orgAdmins']
			});
		},
		onError: (error) => {
			console.error('Failed to delete domain:', error);
		}
	});
};

export const useAddOrgClient = (orgID: string) => {
	return createMutation({
		mutationFn: createOrgClient,
		onSuccess: () => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					Array.isArray(query.queryKey) &&
					query.queryKey[0] === 'orgUsers' &&
					query.queryKey[1] === orgID
			});
		},
		onError: (error) => {
			console.error('Failed to create org client:', error);
		}
	});
};

export const useAddOrgMember = () => {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: createOrgMember,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['orgUsers']
			});
		},
		onError: (error) => {
			console.error('Failed to create org member:', error);
		}
	});
};

/** @deprecated Use Update org user mutation instead */
export const useUpdateOrgAdmin = (orgID: string) => {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: updateAdmin,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: orgKeys.orgAdmins(orgID)
			});
		},
		onError: (error) => {
			console.error('Failed to delete domain:', error);
		}
	});
};

export const useUpdateOrgUser = () => {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: updateOrgUser,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['orgAdmins']
			});
			queryClient.invalidateQueries({
				queryKey: ['orgUsers']
			});
		},
		onError: (error) => {
			console.error('Failed to delete domain:', error);
		}
	});
};

export const useCreateOrg = () => {
	return createMutation({
		mutationFn: createOrg,
		onSuccess: () => {},
		onError: (error) => {
			console.error('Failed to create org:', error);
		}
	});
};

export const useAddOrgSubscription = () => {
	return createMutation({
		mutationFn: updateOrgSubscription,
		onSuccess: () => {
			// queryClient.invalidateQueries({
			// 	queryKey: orgKeys.orgDomains(orgID)
			// });
		},
		onError: (error) => {
			console.error('Failed to delete domain:', error);
		}
	});
};

export const useCreateOrgPromoCode = (orgID?: string) => {
	return createMutation({
		mutationFn: createPromoCode,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: orgKeys.orgPromoCodes(orgID || '')
			});
		},
		onError: (error) => {
			console.error('Failed to create promo:', error);
		}
	});
};

export const useVerifyJoinCode = () => {
	return createMutation({
		mutationFn: verifyJoinCode,
		onSuccess: () => {},
		onError: (error) => {
			console.error('Could not verify join code:', error);
		}
	});
};

export const useJoinOrgWithJoinCode = () => {
	return createMutation({
		mutationFn: joinOrgViaJoinCode,
		onSuccess: () => {},
		onError: (error) => {
			console.error('Could not join organization:', error);
		}
	});
};
