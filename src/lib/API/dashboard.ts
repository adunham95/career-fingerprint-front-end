import { PUBLIC_API_URL } from '$env/static/public';
import { createQuery } from '@tanstack/svelte-query';

export async function getOrgDashboardDetails(orgID: string) {
	try {
		const res = await fetch(`${PUBLIC_API_URL}/reports/${orgID}`, {
			credentials: 'include'
		});
		return res.json();
	} catch (error) {
		console.error(error);
		return null;
	}
}

export const reportKeys = {
	orgDashboard: (id: string) => ['report', 'org', id] as const
};

// Queries

export const useOrgDashboard = (orgID: string) => {
	return createQuery({
		queryKey: reportKeys.orgDashboard(orgID),
		queryFn: () => getOrgDashboardDetails(orgID)
	});
};
