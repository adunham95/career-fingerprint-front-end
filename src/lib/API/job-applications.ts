import { PUBLIC_API_URL } from '$env/static/public';
import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
import type { JobApplication } from '../../app';
import type { AppStatusEnum } from '$lib/Utils/AppStatusTypes';
import { createApiClient } from './apiClient';

export async function fetchMyJobApplications(): Promise<JobApplication[]> {
	const api = createApiClient();
	return api.get('/job-applications/my');
}

export async function fetchMyJobApplicationsList(): Promise<
	Pick<JobApplication, 'id' | 'title' | 'company'>[]
> {
	const api = createApiClient();
	return api.get('/job-applications/my/active');
}

export async function fetchJobApplicationByID(id: string): Promise<JobApplication> {
	const resHighlights = await fetch(`${PUBLIC_API_URL}/job-applications/${id}`, {
		credentials: 'include'
	});

	return resHighlights.json();
}

interface NewJobApp {
	title: string;
	company: string;
	companyURL?: string | null;
	jobStatus?: string | null;
	jobDescription?: string | null;
	location?: string | null;
	status?: AppStatusEnum;
}

export async function postJobApplication(newJobApp: NewJobApp) {
	const url = `${PUBLIC_API_URL}/job-applications`;

	try {
		const res = await fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json' // Set content type to JSON
			},
			body: JSON.stringify(newJobApp)
		});

		if (res.ok) {
			return await res.json();
		} else {
			const message = await res.text();
			throw new Error(`Failed to patch job application: ${res.status} ${message}`);
		}
	} catch (error) {
		console.log(error);
		return null;
	}
}

interface UpdateJobApp {
	id: string;
	title?: string;
	company?: string;
	companyURL?: string | null;
	jobStatus?: string | null;
	jobDescription?: string | null;
	location?: string | null;
	status?: AppStatusEnum;
}

export async function patchJobApplication(updateJobApp: UpdateJobApp) {
	const url = `${PUBLIC_API_URL}/job-applications/${updateJobApp.id}`;

	try {
		const res = await fetch(url, {
			method: 'PATCH',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json' // Set content type to JSON
			},
			body: JSON.stringify(updateJobApp)
		});

		if (res.ok) {
			return await res.json();
		} else {
			const message = await res.text();
			throw new Error(`Failed to patch job application: ${res.status} ${message}`);
		}
	} catch (error) {
		console.log(error);
		return null;
	}
}

export const jobApplicationKeys = {
	all: ['job-apps'] as const,
	my: ['my-jobs', 'job-apps'] as const,
	myList: ['my-jobs', 'job-list'] as const,
	byId: (id: string) => [...jobApplicationKeys.all, id] as const
};

// Queries

export const useMyJobApplicationsQuery = (initialData?: JobApplication[]) => {
	return createQuery({
		queryKey: jobApplicationKeys.my,
		queryFn: fetchMyJobApplications,
		initialData
	});
};

export const useMyJobApplicationsListQuery = (
	initialData?: Pick<JobApplication, 'id' | 'title' | 'company'>[]
) => {
	return createQuery({
		queryKey: jobApplicationKeys.myList,
		queryFn: fetchMyJobApplicationsList,
		initialData
	});
};

export const useJobApplicationByIDQuery = (id: string, initialData?: JobApplication) => {
	return createQuery({
		queryKey: jobApplicationKeys.byId(id),
		queryFn: () => fetchJobApplicationByID(id),
		initialData
	});
};

// Mutations
export const useCreateJobApplicationMutation = () => {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: postJobApplication,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['my-jobs']
			});
		},
		onError: (error) => {
			console.error('Failed to create job application:', error);
		}
	});
};

export const useUpdateJobApplicationMutation = (id?: string) => {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: patchJobApplication,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: jobApplicationKeys.my
			});
			if (id) {
				queryClient.invalidateQueries({
					queryKey: jobApplicationKeys.byId(id)
				});
			}
		},
		onError: (error) => {
			console.error('Failed to create job application:', error);
		}
	});
};
