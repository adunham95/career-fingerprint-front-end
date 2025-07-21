<script lang="ts">
	import { PUBLIC_STRIPE_API_KEY } from '$env/static/public';
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import TwoColumn from '$lib/Components/Containers/TwoColumn.svelte';
	import type { StripeCheckout } from '@stripe/stripe-js';
	import type { Stripe } from '@stripe/stripe-js';
	import { loadStripe } from '@stripe/stripe-js';
	import { format } from 'date-fns';
	import { onMount } from 'svelte';

	let stripe: Stripe | null = null;
	let stripeCheckout: StripeCheckout | null = null;

	// onMount(async () => {
	// 	stripe = await loadStripe(PUBLIC_STRIPE_API_KEY);
	// 	if (stripe) {
	// 		stripe.initCheckout({ fetchClientSecret }).then((checkout) => {
	// 			stripeCheckout = checkout;
	// 			const paymentElement = checkout.createPaymentElement();
	// 			paymentElement.mount('#payment-element');
	// 		});
	// 	}
	// });

	async function fetchClientSecret() {
		await Promise.resolve('');
	}

	const { data } = $props();
	console.log({ data });
</script>

<PageContainer className="divide-y divide-gray-300">
	<TwoColumn title={'Membership Details'}>
		<Card className="md:col-span-2">
			<dl class="divide-y divide-gray-100">
				<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
					<dt class="text-sm/6 font-medium text-gray-900">Tier</dt>
					<dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
						{data.membershipDetails?.plan.name}
					</dd>
				</div>
				<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
					<dt class="text-sm/6 font-medium text-gray-900">Since</dt>
					<dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
						{format(data.membershipDetails?.createdAt || '', 'PPP')}
					</dd>
				</div>
				{#if data.membershipDetails?.currentPeriodEnd}
					<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
						<dt class="text-sm/6 font-medium text-gray-900">Expiries</dt>
						<dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
							{format(data.membershipDetails.currentPeriodEnd, 'PPP')}
						</dd>
					</div>
				{/if}
			</dl>
		</Card>
	</TwoColumn>
	{#if data.membershipDetails?.plan.level === 0}
		<TwoColumn title={'Upgrade'}>
			<Card className="md:col-span-2">
				<h1>Elevate Your Membership</h1>
			</Card>
		</TwoColumn>
	{/if}
	<TwoColumn title={'Billing'}>
		<Card className="md:col-span-2">
			<h1>Billing details</h1>
			<form id="payment-form">
				<div id="payment-element">
					<!-- Elements will create form elements here -->
				</div>
				<button id="submit">Subscribe</button>
				<div id="error-message">
					<!-- Display error message to your customers here -->
				</div>
			</form>
		</Card>
	</TwoColumn>
</PageContainer>
