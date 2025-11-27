import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
import type { Achievement, AchievementTag } from '../../app';
import { createApiClient } from './apiClient';

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
	try {
		const api = createApiClient();
		return api.post('/achievement', {
			...newAchievement,
			startDate: newAchievement.startDate ? new Date(newAchievement.startDate).toISOString() : null,
			endDate: newAchievement.endDate ? new Date(newAchievement.endDate).toISOString() : null
		});
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to create achievement`);
	}
}

export async function updateAchievement({
	achievement,
	id
}: {
	achievement: NewAchievement;
	id: string;
}): Promise<Achievement | null> {
	try {
		const api = createApiClient();
		return api.patch(`/achievement/${id}`, {
			...achievement,
			startDate: achievement.startDate ? new Date(achievement.startDate).toISOString() : null,
			endDate: achievement.endDate ? new Date(achievement.endDate).toISOString() : null
		});
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to update achievement`);
	}
}

export async function createAchievementTag(newTag: { name: string }): Promise<Achievement | null> {
	try {
		const api = createApiClient();
		return api.post('/achievement-tags', newTag);
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to create achievement category`);
	}
}

export async function getAutocompleteAchievementTags(query: string) {
	try {
		const api = createApiClient();
		return api.get<{ name: string }[]>('/achievement-tags/autocomplete', { query });
	} catch (error) {
		console.error(error);
		return [];
	}
}

export async function getAchievementTags(): Promise<AchievementTag[]> {
	try {
		const api = createApiClient();
		return api.get('/achievement-tags');
	} catch (error) {
		console.error(error);
		return [];
	}
}

export async function getPreviewAchievements(): Promise<Achievement[]> {
	try {
		const api = createApiClient();
		return api.get<Achievement[]>('/achievement/my', { page: 1, limit: 5 });
	} catch (error) {
		console.log(error);
		return [];
	}
}

export async function getAchievements(
	includeLinked: boolean | null = null,
	jobPositionID: string | null = null,
	educationID: string | null = null,
	tagID: string | null = null,
	startDate: string | null = null,
	endDate: string | null = null
): Promise<Achievement[]> {
	const api = createApiClient();

	const queries: Record<string, string | number | boolean | undefined> | undefined = {};

	if (includeLinked) {
		queries['includeLinked'] = true;
	}

	if (jobPositionID) {
		queries['jobPositionID'] = jobPositionID;
	}

	if (educationID) {
		queries['educationID'] = educationID;
	}

	if (tagID) {
		queries['tagID'] = tagID;
	}

	if (startDate) {
		queries['startDate'] = startDate;
	}

	if (endDate) {
		queries['endDate'] = endDate;
	}

	return api.get('/achievement/my', queries);
}

export const achievementKeys = {
	all: ['achievements'] as const,
	tags: ['achievement-tags'] as const,
	preview: ['achievements', 'preview'] as const,
	tagsByQuery: (query: string) => [...achievementKeys.tags, query] as const,
	allWithOptions: (
		includedDetails: boolean | null = false,
		jobPositionID: string | null = null,
		educationID: string | null = null,
		tagID: string | null = null,
		startDate: string | null = null,
		endDate: string | null = null
	) =>
		[
			...achievementKeys.all,
			includedDetails,
			jobPositionID,
			educationID,
			tagID,
			startDate,
			endDate
		] as const
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

export const useUpdateAchievementMutation = () => {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: updateAchievement,
		onSuccess: () => {
			queryClient.invalidateQueries({
				predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === 'achievements'
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

export const usePreviewAchievements = () => {
	return createQuery({
		queryKey: achievementKeys.preview,
		queryFn: getPreviewAchievements
	});
};

export const useMyAchievements = (
	initialData: Achievement[] = [],
	includeLinked: null | boolean = null,
	jobPositionID: () => string | null,
	educationID: () => string | null,
	tagID: () => string | null,
	startDate: () => string | null,
	endDate: () => string | null
) => {
	return createQuery({
		queryKey: achievementKeys.allWithOptions(
			includeLinked,
			jobPositionID(),
			educationID(),
			tagID(),
			startDate(),
			endDate()
		),
		queryFn: () =>
			getAchievements(
				includeLinked,
				jobPositionID(),
				educationID(),
				tagID(),
				startDate(),
				endDate()
			),
		initialData
	});
};
