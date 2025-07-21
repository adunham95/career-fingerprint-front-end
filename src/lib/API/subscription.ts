import { PUBLIC_API_URL } from '$env/static/public';
import { createQuery } from '@tanstack/svelte-query';

interface SubscriptionPlan {
	id: string;
	key: string;
	level: number;
	name: string;
	priceCents: number;
	interval: string;
	features: string[];
	metadata: {
		[key: string]: unknown;
	};
	stripePriceID: string | null;
}

interface SubscriptionDetails {
	id: string;
	userID: number;
	planID: string;
	status: string;
	stripeSubId: null;
	trialEndsAt: null;
	currentPeriodEnd: null;
	plan: SubscriptionPlan;
	createdAt: string;
}

export async function getSubscriptionDetails(token?: string): Promise<SubscriptionDetails | null> {
	let options: RequestInit = {
		credentials: 'include'
	};
	if (token) {
		options = {
			headers: {
				Authorization: 'Bearer ' + token
			}
		};
	}

	try {
		const res = await fetch(`${PUBLIC_API_URL}/subscriptions/details`, options);
		console.log({ res });
		if (res.ok) {
			return res.json();
		}
		return null;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function getPlanDetailsByKey(id: string): Promise<SubscriptionPlan | null> {
	try {
		const res = await fetch(`${PUBLIC_API_URL}/subscriptions/plan/${id}`, {
			credentials: 'include'
		});
		console.log({ res });
		if (res.ok) {
			return res.json();
		}
		return null;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export const subscriptionKeys = {
	details: ['subscription-details'] as const,
	planDetailsKey: (key: string) => ['plan-details', key] as const
};

export const useSubscriptionDetails = (initialData?: SubscriptionDetails) => {
	return createQuery({
		queryKey: subscriptionKeys.details,
		queryFn: () => getSubscriptionDetails(),
		initialData
	});
};

export const useGetPlanByID = (key: string) => {
	return createQuery({
		queryKey: subscriptionKeys.planDetailsKey(key),
		queryFn: () => getPlanDetailsByKey(key)
	});
};
