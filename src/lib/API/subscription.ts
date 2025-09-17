import { PUBLIC_API_URL } from '$env/static/public';
import { createMutation, createQuery } from '@tanstack/svelte-query';
import type { Organization } from '../../app';
import { createApiClient, type ApiClient } from './apiClient';

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
	org?: Organization;
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

export async function getSubscriptionDetails(api?: ApiClient) {
	try {
		if (!api) {
			api = createApiClient();
		}
		return api.get('/subscriptions/details');
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

export async function getPlansAvailableToUpgrade(
	api?: ApiClient
): Promise<SubscriptionPlan | null> {
	try {
		if (!api) {
			api = createApiClient();
		}
		return api.get('/subscriptions/plans/available');
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function validateSubscription(
	checkoutID: string,
	api?: ApiClient
): Promise<SubscriptionPlan | null> {
	try {
		if (!api) {
			api = createApiClient();
		}
		// TODO why is this failing on pro plans
		return api.get(`/stripe/validate/${checkoutID}`);
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function createCheckoutSession(newCheckout: {
	priceID: string;
	planID: string;
	couponID?: string;
}): Promise<string> {
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

export async function createOrgCheckoutSession(newCheckout: {
	priceID: string;
	quantity: number;
	couponID?: string;
	orgID: string;
}): Promise<string> {
	const url = `${PUBLIC_API_URL}/stripe/create-checkout-session/org`;

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
			throw new Error(`Failed to start checkout: ${res.status} ${message}`);
		}
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to start checkout`);
	}
}

export async function updateBillingDetails(): Promise<{ checkoutSessionClientSecret: string }> {
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
			return data;
		} else {
			const message = await res.text();
			throw new Error(`Failed to get secret: ${res.status} ${message}`);
		}
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to get secret`);
	}
}

export async function validateCouponCode(data: {
	code: string;
}): Promise<{ valid: boolean; id?: string; code?: string }> {
	const url = `${PUBLIC_API_URL}/stripe/validate-promo`;

	try {
		const res = await fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		if (res.ok) {
			const data = await res.json();
			return data;
		} else {
			const message = await res.text();
			throw new Error(`Failed to validate code: ${res.status} ${message}`);
		}
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to validate code`);
	}
}

export type InvoiceEstimate = {
	currency: string;
	subtotal: number;
	discounts: Array<{
		amount: number;
		promoCode?: string;
		discount: {
			id: string;
			object: string;
		};
	}>;
	tax: Array<{
		amount: number;
	}>;
	total: number;
	formatted: {
		subtotal: string;
		total: string;
	};
	lineItems: Array<{
		description: string;
		amount: number;
		currency: string;
	}>;
};

export async function estimate(data: {
	promoID?: string | null;
	priceID: string | null;
	quantity?: number;
}): Promise<InvoiceEstimate> {
	const url = `${PUBLIC_API_URL}/stripe/estimate`;

	console.log(' estimate');

	try {
		const res = await fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		if (res.ok) {
			const data = await res.json();
			console.log('estimateData', { data });
			return data;
		} else {
			const message = await res.text();
			throw new Error(`Failed to validate code: ${res.status} ${message}`);
		}
	} catch (error) {
		console.log(error);
		throw new Error(`Failed to validate code`);
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

export async function createSubscription(data: {
	planID: string;
	priceID?: string;
	orgID?: string;
	userID?: string;
}) {
	try {
		const res = await fetch(`${PUBLIC_API_URL}/subscriptions`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
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

export async function createSubscriptionTrial(trialData: {
	priceID: string;
	planID: string;
	inviteCode?: string;
	userID?: string;
}) {
	try {
		const res = await fetch(`${PUBLIC_API_URL}/stripe/trial`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(trialData)
		});
		if (res.ok) {
			const data = await res.json();
			return data;
		}
		throw new Error(`Failed to start free trial`);
	} catch (error) {
		console.log({ error });
		throw new Error(`Failed to start free trial`);
	}
}

export const subscriptionKeys = {
	details: ['subscription-details'] as const,
	availablePlans: ['available-plans'] as const,
	estimate: (priceID: string | null, promoID?: string | null) =>
		['estimate', priceID, promoID] as const,
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

export const useGetEstimate = () => {
	return createMutation({
		mutationFn: estimate
	});
};

export const useCreateCheckoutSession = () => {
	return createMutation({
		mutationFn: createCheckoutSession,
		onSuccess: () => {},
		onError: (error) => {
			console.error('Failed to create checkout session:', error);
		}
	});
};

export const useCreateCheckoutOrgSession = () => {
	return createMutation({
		mutationFn: createOrgCheckoutSession,
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

export const useCreateSubscriptionTrial = () => {
	return createMutation({
		mutationFn: createSubscriptionTrial,
		onSuccess: () => {},
		onError: (error) => {
			console.error('Failed to create subscription trail:', error);
		}
	});
};

export const useValidateCouponCode = () => {
	return createMutation({
		mutationFn: validateCouponCode,
		onSuccess: () => {},
		onError: (error) => {
			console.error('Failed to validate coupon code:', error);
		}
	});
};
