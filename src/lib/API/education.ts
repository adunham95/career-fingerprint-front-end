import { PUBLIC_API_URL } from '$env/static/public';
import { createQuery } from '@tanstack/svelte-query';
import type { Education } from '../../app';

export async function fetchMyEducation(): Promise<Education[]> {
	const resHighlights = await fetch(`${PUBLIC_API_URL}/education/my`, {
		credentials: 'include'
	});

	return await resHighlights.json();
}

export const educationKeys = {
	all: ['education'] as const,
	my: ['education', 'my-education'] as const
};

// Queries

export const useMyEducationQuery = (initialData?: Education[]) => {
	return createQuery({
		queryKey: educationKeys.my,
		queryFn: fetchMyEducation,
		initialData
	});
};
