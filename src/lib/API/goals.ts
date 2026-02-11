import { createMutation, createQuery, QueryClient, useQueryClient } from '@tanstack/svelte-query';
import { createApiClient } from './apiClient';
import type { Achievement, Goal, GoalMilestoneChecklistItem } from '../../app';

async function getGoalSkills() {}

interface MilestoneDetails {
	id?: string;
	checklistItems?: GoalMilestoneChecklistItem[];
	checked: boolean;
	setUp?: boolean;
	streak: {
		id: string;
		lastCheckIn?: string | null;
		currentStreak: number;
		hasCheckInThisWeek: boolean;
	};
	linkedAchievements?: { linkType: string; matchReason: string; achievement: Achievement }[];
}

async function getMilestoneDetails(milestoneID: string, type: string) {
	try {
		const api = createApiClient();
		const checklistItems = await api.get<MilestoneDetails>(
			`/goal/milestone/${milestoneID}/${type}`
		);
		return checklistItems;
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to get milestone item`);
	}
}

interface CheckoffMilestoneResponse {
	success: true;
	goalProgress: number;
	milestoneProgress: {
		progress: number;
		targetCount: number;
	};
	details: {
		goalID: string;
		id: string;
	};
}

async function checkoffMilestoneItem({
	milestoneID,
	type,
	body
}: {
	milestoneID: string;
	type: string;
	body: { checked: boolean; key?: string };
}) {
	try {
		const api = createApiClient();
		const checklistItem = await api.patch<CheckoffMilestoneResponse>(
			`/goal/milestone/${milestoneID}/${type}`,
			body
		);
		return checklistItem;
	} catch (error) {
		console.log(error);
		throw new Error(`Failed get goals`);
	}
}

async function getMyGoals(query: {
	page?: number;
	limit?: number;
	active?: boolean;
	showProgress?: boolean;
}) {
	try {
		const api = createApiClient();
		const skills = await api.get<Goal[]>('/goal/my', query);
		return skills;
	} catch (error) {
		console.log(error);
		throw new Error(`Failed get goals`);
	}
}

async function createGoal(data: {
	templateKey?: string;
	title: string;
	description: string;
	milestones: {
		type: string;
		title: string;
		keywords: string[];
		streak: number;
		checklist: string[];
		targetCount: number;
	}[];
}) {
	try {
		const api = createApiClient();
		return api.post('/goal', data);
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to send thank you note`);
	}
}

export const goalsKeys = {
	goalSkills: ['goalSkills'] as const,
	allGoals: ['allGoals'] as const,
	list: (query: { page?: number; limit?: number; active?: boolean; showProgress?: boolean }) =>
		[...goalsKeys.allGoals, query] as const,
	milestoneItems: (milestoneID: string, type: string) =>
		['milestoneItem', milestoneID, type] as const
};

// QUERIES

export const useGetGoalSkills = () => {
	return createQuery({
		queryKey: goalsKeys.goalSkills,
		queryFn: () => getGoalSkills()
	});
};

export const useGetMyGoals = (
	query: {
		page?: number;
		limit?: number;
		active?: boolean;
		showProgress?: boolean;
	},
	enabled = true
) => {
	return createQuery({
		queryKey: goalsKeys.list(query),
		queryFn: () => getMyGoals(query),
		enabled
	});
};

export const useGetMilestoneDetails = (milestoneID: string, type: string) => {
	return createQuery({
		queryKey: goalsKeys.milestoneItems(milestoneID, type),
		queryFn: () => getMilestoneDetails(milestoneID, type)
	});
};

// MUTATIONS

export const useCreateGoal = () => {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: createGoal,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: goalsKeys.allGoals
			});
		},
		onError: (error) => {
			console.error('Failed to create goal:', error);
		}
	});
};

export const useCheckoffMilestone = (milestoneID: string, type: string) => {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: checkoffMilestoneItem,
		onSuccess: (res) => {
			patchMilestoneProgressInCachedGoalLists(
				queryClient,
				res.details.goalID,
				res.details.id,
				res.goalProgress,
				res.milestoneProgress
			);
			queryClient.invalidateQueries({
				queryKey: goalsKeys.milestoneItems(milestoneID, type)
			});
		},
		onError: (error) => {
			console.error('Failed to create goal:', error);
		}
	});
};

// Helpers

function patchMilestoneProgressInCachedGoalLists(
	qc: QueryClient,
	goalID: string,
	milestoneID: string,
	goalProgress: number,
	next: { progress: number; targetCount: number }
) {
	const entries = qc.getQueriesData<Goal[]>({ queryKey: goalsKeys.allGoals });

	for (const [key, data] of entries) {
		if (!data) continue;
		if (!data.some((g) => g.id === goalID)) continue;

		qc.setQueryData<Goal[]>(
			key,
			data.map((g) => {
				if (g.id !== goalID) return g;

				return {
					...g,
					progress: goalProgress,
					milestones: g.milestones.map((m) => (m.id === milestoneID ? { ...m, ...next } : m))
				};
			})
		);
	}
}
