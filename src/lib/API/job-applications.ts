import { PUBLIC_API_URL } from '$env/static/public';
import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
import type { JobApplication } from '../../app';

export async function fetchMyJobApplications(): Promise<JobApplication[]> {
	const resHighlights = await fetch(`${PUBLIC_API_URL}/job-applications/my`, {
		credentials: 'include'
	});

	return resHighlights.json();
}

interface NewJobApp {
	title: string;
	company: string;
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

export const jobApplicationKeys = {
	all: ['job-apps'] as const,
	my: ['my-jobs', 'job-apps'] as const
};

// Queries

export const useMyJobApplicationsQuery = (initialData?: JobApplication[]) => {
	return createQuery({
		queryKey: jobApplicationKeys.my,
		queryFn: fetchMyJobApplications,
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
				queryKey: jobApplicationKeys.my
			});
		},
		onError: (error) => {
			console.error('Failed to create job application:', error);
		}
	});
};
