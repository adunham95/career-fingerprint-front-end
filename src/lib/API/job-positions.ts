import { PUBLIC_API_URL } from '$env/static/public';
import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
import type { BulletPoint, JobPosition } from '../../app';

export async function fetchMyJobPositions(): Promise<JobPosition[]> {
	const resHighlights = await fetch(`${PUBLIC_API_URL}/job-positions/my`, {
		credentials: 'include'
	});

	return resHighlights.json();
}

export async function addJobAppToJobPosition(appID: string): Promise<JobPosition[] | null> {
	const url = `${PUBLIC_API_URL}/job-positions/application`;

	try {
		const res = await fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ appID })
		});

		if (res.ok) {
			return await res.json();
		} else {
			const message = await res.text();
			throw new Error(`Failed to patch meeting: ${res.status} ${message}`);
		}
	} catch (error) {
		console.log(error);
		throw new Error('Failed to migrate the job application');
	}
}

export async function addBulletPointToJobApp({
	text,
	jobPositionID,
	resumeID
}: {
	jobPositionID: string;
	text: string;
	resumeID: string;
}): Promise<BulletPoint> {
	const url = `${PUBLIC_API_URL}/job-positions/${jobPositionID}/bullet-point`;

	try {
		const res = await fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ text, resumeID })
		});

		if (res.ok) {
			return await res.json();
		} else {
			const message = await res.text();
			throw new Error(`Failed to patch meeting: ${res.status} ${message}`);
		}
	} catch (error) {
		console.log(error);
		throw new Error('Failed to migrate the job application');
	}
}

export async function deleteBulletPointOnJobApp({
	bulletPointID
}: {
	bulletPointID: string;
}): Promise<BulletPoint> {
	const url = `${PUBLIC_API_URL}/job-positions/bullet-point/${bulletPointID}`;

	try {
		const res = await fetch(url, {
			method: 'DELETE',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (res.ok) {
			return await res.json();
		} else {
			const message = await res.text();
			throw new Error(`Failed to delete bullet point. ${message}`);
		}
	} catch (error) {
		console.log(error);
		throw new Error('Failed to delete bullet point');
	}
}

export const jobPositionKeys = {
	all: ['job-pos'] as const,
	my: ['my-pos', 'job-pos'] as const
};

// Queries

export const useMyJobPositionsQuery = (initialData?: JobPosition[]) => {
	return createQuery({
		queryKey: jobPositionKeys.my,
		queryFn: fetchMyJobPositions,
		initialData
	});
};

// Mutations

export const useCreateJobPositionFromApp = () => {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: addJobAppToJobPosition,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: jobPositionKeys.all
			});
		},
		onError: (error) => {
			console.error('Failed to merge job application:', error);
		}
	});
};

export const useCreateJobPositionBulletPoint = () => {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: addBulletPointToJobApp,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: jobPositionKeys.my
			});
		},
		onError: (error) => {
			console.error('Failed to add bullet point:', error);
		}
	});
};

export const useDeleteJobPositionBulletPoint = () => {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: deleteBulletPointOnJobApp,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: jobPositionKeys.my
			});
		},
		onError: (error) => {
			console.error('Failed to delete bullet point:', error);
		}
	});
};
