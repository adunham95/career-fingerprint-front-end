import { PUBLIC_API_URL } from '$env/static/public';
import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';

export interface NewCoverLetter {
	id?: string;
	to?: string;
	message?: string;
	jobAppID: string;
}

export interface CoverLetter {
	id: string;
	to: string;
	message: string;
	jobAppID: string;
}

export async function patchCoverLetter(coverLetter: NewCoverLetter): Promise<CoverLetter | null> {
	console.info('patchCoverLetter', coverLetter);
	const url = `${PUBLIC_API_URL}/cover-letters/jobApp/${coverLetter.jobAppID}`;

	try {
		const res = await fetch(url, {
			method: 'PATCH',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(coverLetter)
		});

		if (res.ok) {
			return await res.json();
		} else {
			const message = await res.text();
			throw new Error(`Failed to update cover letter: ${res.status} ${message}`);
		}
	} catch (error) {
		console.log(error);
		return null;
	}
}

export async function getCoverLetterByJob(jobAppID: string): Promise<CoverLetter | null> {
	const url = `${PUBLIC_API_URL}/cover-letters/jobApp/${jobAppID}`;
	try {
		const res = await fetch(url, {
			credentials: 'include'
		});
		return res.json();
	} catch (error) {
		console.error(error);
		return null;
	}
}

export const coverLetterKeys = {
	all: ['coverLetter'] as const,
	coverLetterForJob: (jobID: string) => [...coverLetterKeys.all, jobID] as const
};

export const useUpdateCoverLetterMutation = (jobID: string) => {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: patchCoverLetter,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: coverLetterKeys.coverLetterForJob(jobID)
			});
			queryClient.invalidateQueries({
				queryKey: coverLetterKeys.all
			});
		},
		onError: (error) => {
			console.error('Failed to update cover letter:', error);
		}
	});
};

export const useCoverLetterByJobApplication = (jobID: string, initialData?: CoverLetter) => {
	return createQuery({
		queryKey: coverLetterKeys.coverLetterForJob(jobID),
		queryFn: () => getCoverLetterByJob(jobID),
		initialData
	});
};
