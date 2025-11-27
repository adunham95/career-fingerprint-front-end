import { createMutation, createQuery } from '@tanstack/svelte-query';
import { createApiClient } from './apiClient';

interface GoalSkill {
	id: string;
	name: string;
	category: string;
	description: string;
	keywords: string[];
	actions: string[];
}

interface Goal {
	id: string;
	createdAt: string;
	updatedAt: string;
	name: string;
	userID: number;
	keywords: string[];
	actions: string[];
	targetCount: number;
	completedAt: string | null;
	lastProgressCalculatedAt: string;
	status: 'active' | 'complete' | 'archived';
	progress: number;
	currentPoints: number;
}

async function getGoalSkills() {
	try {
		const api = createApiClient();
		const skills = await api.get<GoalSkill[]>('/goal/skills');
		return skills;
	} catch (error) {
		console.log(error);
		throw new Error(`Failed get goal skill`);
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
	name: string;
	actions: string[];
	keywords: string[];
	targetCount: number;
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
	allGoals: ['alLGoals'] as const,
	allGoalsPage: (page: number) => [...goalsKeys.allGoals, page] as const
};

// QUERIES

export const useGetGoalSkills = () => {
	return createQuery({
		queryKey: goalsKeys.goalSkills,
		queryFn: () => getGoalSkills()
	});
};

export const useGetMyGoals = (query: {
	page?: number;
	limit?: number;
	active?: boolean;
	showProgress?: boolean;
}) => {
	return createQuery({
		queryKey: goalsKeys.allGoals,
		queryFn: () => getMyGoals(query)
	});
};

// MUTATIONS

export const useCreateGoal = () => {
	return createMutation({
		mutationFn: createGoal,
		onSuccess: () => {},
		onError: (error) => {
			console.error('Failed to create goal:', error);
		}
	});
};
