import { PUBLIC_API_URL } from '$env/static/public';
import { createQuery } from '@tanstack/svelte-query';
import type { JobPosition } from '../../app';

export async function fetchMyJobPositions(): Promise<JobPosition[]> {
	const resHighlights = await fetch(`${PUBLIC_API_URL}/job-positions/my`, {
		credentials: 'include'
	});

	return resHighlights.json();
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
