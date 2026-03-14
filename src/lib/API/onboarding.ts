import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import type { Achievement, JobPosition } from '../../app';
import { achievementKeys } from './achievements';
import { createApiClient } from './apiClient';
import { jobPositionKeys } from './job-positions';

interface OnboardingJob {
	name?: string | null;
	company?: string | null;
	location?: string | null;
	description?: string | null;
	startDate?: string | null;
	endDate?: string | null;
	currentPosition?: boolean | null;
}

interface OnboardingAchievement {
	description?: string;
	result?: string;
	myContribution: string;
	startDate?: string | null;
	endDate?: string | null;
	achievementTags?: string[];
	jobName?: string;
}

export async function createOnboardingJob(job: OnboardingJob): Promise<JobPosition | null> {
	const api = createApiClient();
	return api.post('/onboarding/new/job', {
		...job,
		startDate: job.startDate ? new Date(job.startDate).toISOString() : null,
		endDate: job.endDate ? new Date(job.endDate).toISOString() : null
	});
}

export async function createOnboardingAchievement(
	achievement: OnboardingAchievement
): Promise<Achievement | null> {
	const api = createApiClient();
	return api.post('/onboarding/new/achievement', {
		...achievement,
		startDate: achievement.startDate ? new Date(achievement.startDate).toISOString() : null,
		endDate: achievement.endDate ? new Date(achievement.endDate).toISOString() : null
	});
}

export const useCreateOnboardingJobMutation = () => {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: createOnboardingJob,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: jobPositionKeys.my });
		},
		onError: (error) => {
			console.error('Failed to create onboarding job:', error);
		}
	});
};

export const useCreateOnboardingAchievementMutation = () => {
	const queryClient = useQueryClient();
	return createMutation({
		mutationFn: createOnboardingAchievement,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: achievementKeys.all });
		},
		onError: (error) => {
			console.error('Failed to create onboarding achievement:', error);
		}
	});
};
