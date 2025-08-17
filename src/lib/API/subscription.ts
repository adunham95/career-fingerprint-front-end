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
	plan?: {
		level: number;
	};
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
		// TODO why is this failing on pro plans
		if (res.ok) {
			const data = await res.json();
			console.log(data);
			return data;
		}
		return null;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function validateSubscription(
	checkoutID: string,
	token?: string
): Promise<SubscriptionPlan | null> {
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
		const res = await fetch(`${PUBLIC_API_URL}/stripe/validate/${checkoutID}`, options);
		// TODO why is this failing on pro plans
		if (res.ok) {
			const data = await res.json();
			console.log(data);
			return data;
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

export async function updateBillingDetails(): Promise<string> {
	const url = `${PUBLIC_API_URL}/stripe/update-billing`;

	try {
		const res = await fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({})
		});

		if (res.ok) {
			const data = await res.json();
			return data.checkoutSessionClientSecret;
		} else {
			const message = await res.text();
			throw new Error(`Failed to get secret: ${res.status} ${message}`);
		}
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to get secret`);
	}
}

export async function cancelSubscription(subscriptionID: string) {
	try {
		const res = await fetch(`${PUBLIC_API_URL}/subscriptions/cancel/${subscriptionID}`, {
			method: 'DELETE',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		if (res.ok) {
			const data = await res.json();
			return data;
		}
		throw new Error(`Failed to create cancel subscription`);
	} catch (error) {
		console.log({ error });
		throw new Error(`Failed to create cancel subscription`);
	}
}

export async function createSubscription({
	priceID,
	sessionID
}: {
	priceID: string;
	sessionID: string;
}) {
	try {
		const res = await fetch(`${PUBLIC_API_URL}/subscriptions`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ priceID, sessionID })
		});
		if (res.ok) {
			const data = await res.json();
			return data;
		}
		throw new Error(`Failed to create cancel subscription`);
	} catch (error) {
		console.log({ error });
		throw new Error(`Failed to create cancel subscription`);
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

export const useUpdateBilling = () => {
	return createMutation({
		mutationFn: updateBillingDetails,
		onSuccess: () => {},
		onError: (error) => {
			console.error('Failed to update billing details:', error);
		}
	});
};

export const useCancelSubscription = () => {
	return createMutation({
		mutationFn: cancelSubscription,
		onSuccess: () => {},
		onError: (error) => {
			console.error('Failed to cancel subscription:', error);
		}
	});
};

export const useCreateSubscription = () => {
	return createMutation({
		mutationFn: createSubscription,
		onSuccess: () => {},
		onError: (error) => {
			console.error('Failed to create subscription:', error);
		}
	});
};
