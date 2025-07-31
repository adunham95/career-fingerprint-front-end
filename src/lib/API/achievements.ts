import { PUBLIC_API_URL } from '$env/static/public';
import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
import type { Achievement } from '../../app';

interface NewAchievement {
	description: string;
	result: string;
	myContribution: string;
	jobPositionID?: string | null;
	educationID?: string | null;
	startDate?: string | null;
	endDate?: string | null;
	achievementTags: string[] | null;
}

export async function createAchievement(
	newAchievement: NewAchievement
): Promise<Achievement | null> {
	const url = `${PUBLIC_API_URL}/achievement`;

	console.log({ newAchievement });

	try {
		const res = await fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json' // Set content type to JSON
			},
			body: JSON.stringify({
				...newAchievement,
				startDate: newAchievement.startDate
					? new Date(newAchievement.startDate).toISOString()
					: null,
				endDate: newAchievement.endDate ? new Date(newAchievement.endDate).toISOString() : null
			})
		});

		if (res.ok) {
			return await res.json();
		} else {
			const message = await res.text();
			throw new Error(`Failed to create achievement: ${res.status} ${message}`);
		}
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to create achievement`);
	}
}

export async function createAchievementTag(newTag: { name: string }): Promise<Achievement | null> {
	const url = `${PUBLIC_API_URL}/achievement-tags`;

	console.log({ newTag });

	try {
		const res = await fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json' // Set content type to JSON
			},
			body: JSON.stringify(newTag)
		});

		if (res.ok) {
			return await res.json();
		} else {
			const message = await res.text();
			throw new Error(`Failed to create category: ${res.status} ${message}`);
		}
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to create achievement category`);
	}
}

export async function getAutocompleteAchievementTags(query: string) {
	try {
		const res = await fetch(`${PUBLIC_API_URL}/achievement-tags/autocomplete?query=${query}`, {
			credentials: 'include'
		});
		return res.json();
	} catch (error) {
		console.error(error);
		return [];
	}
}

export async function getAchievementTags() {
	try {
		const res = await fetch(`${PUBLIC_API_URL}/achievement-tags`, {
			credentials: 'include'
		});
		return res.json();
	} catch (error) {
		console.error(error);
		return [];
	}
}

export async function getAchievements() {
	try {
		const res = await fetch(`${PUBLIC_API_URL}/achievement/my?includeLinked=true`, {
			credentials: 'include'
		});
		return res.json();
	} catch (error) {
		console.error(error);
		return [];
	}
}

export const achievementKeys = {
	all: ['achievements'] as const,
	tags: ['achievement-tags'] as const,
	tagsByQuery: (query: string) => [...achievementKeys.tags, query] as const
};

export const useCreateAchievementMutation = () => {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: createAchievement,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: achievementKeys.all
			});
		},
		onError: (error) => {
			console.error('Failed to create achievements:', error);
		}
	});
};

export const useCreateAchievementTagMutation = () => {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: createAchievementTag,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: achievementKeys.tags
			});
		},
		onError: (error) => {
			console.error('Failed to create achievement tag:', error);
		}
	});
};

export const useAutocompleteAchievementTags = (query: () => string) => {
	console.log({ query: query() });
	return createQuery({
		queryKey: achievementKeys.tagsByQuery(query()),
		queryFn: () => getAutocompleteAchievementTags(query()),
		staleTime: 30 * 1000, // 30 seconds: still fresh
		refetchOnWindowFocus: false
	});
};

export const useAchievementTags = () => {
	return createQuery({
		queryKey: achievementKeys.tags,
		queryFn: getAchievementTags
	});
};

export const useMyAchievements = (initialData?: Achievement[]) => {
	return createQuery({
		queryKey: achievementKeys.all,
		queryFn: getAchievements,
		initialData
	});
};
