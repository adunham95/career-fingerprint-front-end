<script lang="ts">
	import { PUBLIC_STRIPE_API_KEY } from '$env/static/public';
	import {
		useCancelSubscription,
		useCreateCheckoutSession,
		useCreateSubscription
	} from '$lib/API/subscription.js';
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import TwoColumn from '$lib/Components/Containers/TwoColumn.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast.js';
	import { centsToDollars } from '$lib/Utils/centsToDollars.js';
	import type { StripeCheckout } from '@stripe/stripe-js';
	import type { Stripe } from '@stripe/stripe-js';
	import { loadStripe } from '@stripe/stripe-js';
	import { format } from 'date-fns';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';

	let stripe: Stripe | null = null;
	let stripeCheckout: StripeCheckout | null = null;
	let priceID: string | null = $state(null);
	const startCheckout = useCreateCheckoutSession();
	const cancelMembershipMutation = useCancelSubscription();

	onMount(async () => {
		stripe = await loadStripe(PUBLIC_STRIPE_API_KEY);
	});

	function updateStripe(newPriceID: string) {
		priceID = newPriceID;
		if (stripe) {
			stripe.initCheckout({ fetchClientSecret }).then((checkout) => {
				stripeCheckout = checkout;
				const paymentElement = checkout.createPaymentElement();
				paymentElement.mount('#payment-element');
				const button = document.getElementById('pay-button');
				if (button) {
					button.addEventListener('click', () => {
						// Clear any validation errors
						// errors.textContent = '';

						checkout.confirm().then(async (result) => {
							console.log(result);

							if (result.type === 'error') {
								// errors.textContent = result.error.message;
							}
							if (result.type === 'success') {
								console.log(result.session.id);
							}
						});
					});
				}
			});
		}
	}

	async function fetchClientSecret() {
		if (priceID) {
			let response = await $startCheckout.mutateAsync({ priceID });
			console.log({ response });
			return response;
		}
		return '';
	}

	async function cancelMembership() {
		try {
			await $cancelMembershipMutation.mutateAsync(data.membershipDetails?.id || '');
			invalidateAll();
			toastStore.show({ message: 'Canceled Subscription', type: 'success' });
		} catch (error) {
			toastStore.show({ message: 'Error canceling subscription', type: 'error' });
		}
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
				{#if data.membershipDetails?.createdAt}
					<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
						<dt class="text-sm/6 font-medium text-gray-900">Since</dt>
						<dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
							{format(data.membershipDetails?.createdAt || '', 'PPP')}
						</dd>
					</div>
				{/if}
				{#if data.membershipDetails?.currentPeriodEnd}
					<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
						<dt class="text-sm/6 font-medium text-gray-900">Expiries</dt>
						<dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
							{format(data.membershipDetails.currentPeriodEnd, 'PPP')}
						</dd>
					</div>
				{/if}
			</dl>
			{#snippet actions()}
				{#if (data.membershipDetails?.plan.level || 0) > 0}
					<button class="btn btn--error" onclick={cancelMembership}>Cancel Membership</button>
				{:else}
					<button class="btn btn--disabled" disabled>Cancel Membership</button>
				{/if}
			{/snippet}
		</Card>
	</TwoColumn>
	{#if data.availablePlans}
		<TwoColumn title={'Upgrade'}>
			<Card
				className="md:col-span-2  rounded-2xl bg-gray-50  ring-1 ring-gray-900/5 ring-inset lg:flex lg:flex-col lg:justify-center "
			>
				<div class={`px-8 ${priceID === null ? '' : 'hidden'}`}>
					<p class="text-center text-lg font-semibold text-gray-600">{data.availablePlans.name}</p>
					<p class="text-center text-base font-semibold text-gray-600">
						Select a billing type to get started
					</p>
					<div class="grid grid-cols-2 gap-4">
						<div>
							<p class="mt-6 flex items-baseline justify-center gap-x-2">
								<span class="text-5xl font-semibold tracking-tight text-gray-900">
									${centsToDollars(data.availablePlans.priceCentsYear)}
								</span>
								<span class="text-sm/6 font-semibold tracking-wide text-gray-600">/year</span>
							</p>
							{#if data.availablePlans.annualStripePriceID !== null}
								<button
									onclick={() => updateStripe(data.availablePlans?.annualStripePriceID || '')}
									class="btn btn--secondary btn-small mt-10 w-full">Upgrade</button
								>
							{/if}
						</div>
						<div>
							<p class="mt-6 flex items-baseline justify-center gap-x-2">
								<span class="text-5xl font-semibold tracking-tight text-gray-900">
									${centsToDollars(data.availablePlans.priceCents)}
								</span>
								<span class="text-sm/6 font-semibold tracking-wide text-gray-600">/mo</span>
							</p>
							<button
								onclick={() => updateStripe(data.availablePlans?.monthlyStripePriceID || '')}
								class="btn btn--primary btn-small mt-10 w-full">Upgrade</button
							>
						</div>
					</div>
					<div class="flex pt-4">
						<TextInput id="coupon-code" label="Coupon Code" className="w-full" />
						<button class="btn btn-text--primary ml-2">Apply</button>
					</div>
				</div>
				<form id="payment-form">
					<div id="payment-element">
						<!-- Elements will create form elements here -->
					</div>
					<button
						id="pay-button"
						class={`btn btn--primary mt-2 ${priceID === null ? 'hidden' : ''}`}>Subscribe</button
					>
					<div id="error-message">
						<!-- Display error message to your customers here -->
					</div>
				</form>
			</Card>
		</TwoColumn>
	{/if}
</PageContainer>
