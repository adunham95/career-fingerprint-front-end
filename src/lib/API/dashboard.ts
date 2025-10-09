import { PUBLIC_API_URL } from '$env/static/public';
import { createQuery } from '@tanstack/svelte-query';

export async function getOrgDashboardDetails(orgID: string) {
	try {
		const res = await fetch(`${PUBLIC_API_URL}/reports/${orgID}/weekly`, {
			credentials: 'include'
		});
		return res.json();
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function getOrgSeatUtilization(orgID: string) {
	try {
		const res = await fetch(`${PUBLIC_API_URL}/reports/${orgID}/seat-utilization`, {
			credentials: 'include'
		});
		return res.json();
	} catch (error) {
		console.error(error);
		return null;
	}
}

export const reportKeys = {
	orgDashboard: (id: string) => ['report', 'org', id] as const,
	orgSeats: (id: string) => ['report', 'org-seats', id] as const
};

// Queries

export const useOrgDashboard = (orgID: string) => {
	return createQuery({
		queryKey: reportKeys.orgDashboard(orgID),
		queryFn: () => getOrgDashboardDetails(orgID)
	});
};

export const useOrgSeatUtilization = (orgID: string) => {
	return createQuery({
		queryKey: reportKeys.orgSeats(orgID),
		queryFn: () => getOrgSeatUtilization(orgID)
	});
};
