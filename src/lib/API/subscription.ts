import { PUBLIC_API_URL } from '$env/static/public';
import { createMutation, createQuery } from '@tanstack/svelte-query';

interface SubscriptionPlan {
	id: string;
	key: string;
	level: number;
	name: string;
	priceCents: number;
	priceCentsYear: number;
	interval: string;
	features: string[];
	metadata: {
		[key: string]: unknown;
	};
	monthlyStripePriceID: string | null;
	annualStripePriceID: string | null;
	description: string | null;
	featureList: string[];
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
		} else {
			console.log('Error');
			throw new Error('Error Fetching membership subscription');
		}
		return null;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function getPlanDetailsByKey(id: string): Promise<SubscriptionPlan | null> {
	try {
		const res = await fetch(`${PUBLIC_API_URL}/subscriptions/plans/${id}`, {
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

export async function getPlansAvailableToUpgrade(token?: string): Promise<SubscriptionPlan | null> {
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
		const res = await fetch(`${PUBLIC_API_URL}/subscriptions/plans/available`, options);
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

export async function createCheckoutSession(newCheckout: { priceID: string }): Promise<string> {
	const url = `${PUBLIC_API_URL}/stripe/create-checkout-session`;

	try {
		const res = await fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newCheckout)
		});

		if (res.ok) {
			const data = await res.json();
			return data.checkoutSessionClientSecret;
		} else {
			const message = await res.text();
			throw new Error(`Failed to create meeting: ${res.status} ${message}`);
		}
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to create meeting`);
	}
}

export const subscriptionKeys = {
	details: ['subscription-details'] as const,
	availablePlans: ['available-plans'] as const,
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

export const useGetAvailablePlans = () => {
	return createQuery({
		queryKey: subscriptionKeys.availablePlans,
		queryFn: () => getPlansAvailableToUpgrade()
	});
};

// Mutations

export const useCreateCheckoutSession = () => {
	return createMutation({
		mutationFn: createCheckoutSession,
		onSuccess: () => {},
		onError: (error) => {
			console.error('Failed to create checkout session:', error);
		}
	});
};
