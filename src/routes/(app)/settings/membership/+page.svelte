<script lang="ts">
	import { PUBLIC_STRIPE_API_KEY } from '$env/static/public';
	import {
		useCancelSubscription,
		useCreateCheckoutSession,
		useGetEstimate,
		type InvoiceEstimate
	} from '$lib/API/subscription.js';
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import TwoColumn from '$lib/Components/Containers/TwoColumn.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast.js';
	import { centsToDollars } from '$lib/Utils/centsToDollars.js';
	import type { StripeCheckout } from '@stripe/stripe-js';
	import type { Stripe } from '@stripe/stripe-js';
	import { loadStripe } from '@stripe/stripe-js';
	import { format } from 'date-fns';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { trackingStore } from '$lib/Stores/tracking.js';
	import Loader from '$lib/Components/Loader.svelte';
	import DiscountCodeInput from '$lib/Components/DiscountCodeInput.svelte';
	import BillingEstimate from '$lib/Components/BillingEstimate.svelte';
	import MembershipStatusBadge from '$lib/Components/MembershipStatusBadge.svelte';

	let stripe: Stripe | null = null;
	let stripeCheckout: StripeCheckout | null = null;
	let priceID: string | null = $state(null);
	let promoID: string | null = $state(null);
	let showBillingForm: boolean = $state(false);
	let stripeCheckoutLoading: boolean = $state(false);
	let checkingOut = $state(false);
	let orderEstimate = $state<null | InvoiceEstimate>(null);

	const startCheckout = useCreateCheckoutSession();
	const cancelMembershipMutation = useCancelSubscription();
	const orderEstimateCall = useGetEstimate();

	onMount(async () => {
		stripe = await loadStripe(PUBLIC_STRIPE_API_KEY);
		trackingStore.pageViewEvent('Membership Settings');
	});

	async function updateStripe(newPriceID: string) {
		orderEstimate = await $orderEstimateCall.mutateAsync({ promoID, priceID: newPriceID });
		priceID = newPriceID;
		stripeCheckoutLoading = true;
		showBillingForm = true;
		if (stripe) {
			stripe.initCheckout({ fetchClientSecret }).then((checkout) => {
				console.log({ checkout });
				stripeCheckout = checkout;
				const paymentElement = checkout.createPaymentElement();
				const billingAddressElement = checkout.createBillingAddressElement();
				paymentElement.mount('#payment-element');
				billingAddressElement.mount('#billing-element');
				billingAddressElement.on('change', async () => {
					orderEstimate = await $orderEstimateCall.mutateAsync({ promoID, priceID: newPriceID });
				});
				paymentElement.on('ready', function (event) {
					// Handle ready event
					stripeCheckoutLoading = false;
				});
				const button = document.getElementById('pay-button');
				const errors = document.getElementById('error-message');
				if (button) {
					button.addEventListener('click', () => {
						checkingOut = true;
						// Clear any validation errors
						if (errors) {
							errors.textContent = '';
						}
						checkout.confirm().then(async (result) => {
							console.log(result);

							if (result.type === 'error' && errors) {
								errors.textContent = result.error.message;
							}
							if (result.type === 'success') {
								console.log(result.session.id);
							}
							checkingOut = false;
						});
					});
				}
			});
		}
	}

	async function fetchClientSecret() {
		if (priceID) {
			let response = await $startCheckout.mutateAsync({
				priceID,
				planID: data.availablePlans?.id || '',
				couponID: promoID || undefined
			});
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

	function canCancel() {
		switch (data.membershipDetails?.status) {
			case 'canceling':
			case 'org-managed':
			case 'canceled-stripe':
			case 'canceled-client':
			case 'trialing':
				return false;
		}
		return true;
	}
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
					<dt class="text-sm/6 font-medium text-gray-900">Status</dt>
					<dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
						<MembershipStatusBadge status={data.membershipDetails?.status || 'Active'} />
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
				{#if data.membershipDetails?.trialEndsAt}
					<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
						<dt class="text-sm/6 font-medium text-gray-900">Subscription Ends</dt>
						<dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
							{format(data.membershipDetails.trialEndsAt, 'PPP')}
						</dd>
					</div>
				{/if}
			</dl>
			{#snippet actions()}
				{#if (data.membershipDetails?.plan.level || 0) > 0}
					<button
						class={`btn ${canCancel() ? 'btn--error' : 'btn--disabled opacity-30'}`}
						disabled={canCancel()}
						onclick={() => {
							cancelMembership();
							trackingStore.trackAction('Cancel Membership Click', {
								plan: data.membershipDetails?.plan.name || ''
							});
						}}>Cancel Membership</button
					>
				{:else}
					<button class="btn btn--disabled" disabled>Cancel Membership</button>
				{/if}
			{/snippet}
		</Card>
	</TwoColumn>
	{#if data.availablePlans && data.availablePlans.level > data.user.planLevel}
		<TwoColumn title={'Upgrade'}>
			{#snippet subSection()}
				{#if showBillingForm}
					<BillingEstimate
						discounts={orderEstimate?.discounts.map((d) => d.amount) || []}
						subTotal={orderEstimate?.subtotal || 0}
						taxes={orderEstimate?.tax.map((t) => t.amount) || []}
						total={orderEstimate?.total || 0}
					/>
				{/if}
			{/snippet}
			<Card
				className="md:col-span-2  rounded-2xl bg-gray-50  ring-3 ring-gray-900/5 ring-inset lg:flex lg:flex-col lg:justify-center "
			>
				<div class={`px-8`}>
					<p class="text-center text-lg font-semibold text-gray-600">{data.availablePlans.name}</p>
					<p class="text-center text-base font-semibold text-gray-600">
						Select a billing type to get started
					</p>
					<div class="grid grid-cols-2 gap-4">
						<div>
							{#if data.availablePlans.annualStripePriceID !== null}
								<p class="mt-6 flex items-baseline justify-center gap-x-2">
									<span class="text-5xl font-semibold tracking-tight text-gray-900">
										${centsToDollars(data.availablePlans.priceCentsYear)}
									</span>
									<span class="text-sm/6 font-semibold tracking-wide text-gray-600">/year</span>
								</p>
								<button
									onclick={() => {
										priceID = data.availablePlans?.annualStripePriceID || null;
										updateStripe(data.availablePlans?.annualStripePriceID || '');
										trackingStore.trackAction('Upgrade Plan', {
											type: 'Yearly',
											planKey: data.availablePlans?.key || ''
										});
									}}
									class="btn btn--secondary btn-small mt-10 w-full">Select</button
								>
							{/if}
						</div>
						<div>
							{#if data.availablePlans.monthlyStripePriceID}
								<p class="mt-6 flex items-baseline justify-center gap-x-2">
									<span class="text-5xl font-semibold tracking-tight text-gray-900">
										${centsToDollars(data.availablePlans.priceCents)}
									</span>
									<span class="text-sm/6 font-semibold tracking-wide text-gray-600">/mo</span>
								</p>
								<button
									onclick={() => {
										priceID = data.availablePlans?.monthlyStripePriceID || '';
										updateStripe(data.availablePlans?.monthlyStripePriceID || '');
										trackingStore.trackAction('Upgrade Plan', {
											type: 'Monthly',
											planKey: data.availablePlans?.key || ''
										});
									}}
									class="btn btn--primary btn-small mt-10 w-full">Select</button
								>
							{/if}
						</div>
					</div>
					<div class="w-full pt-4">
						<DiscountCodeInput
							bind:promoID
							promoValidated={() => priceID && updateStripe(priceID)}
						/>
					</div>
				</div>
				<form
					id="payment-form"
					class={`relative ${!showBillingForm ? 'hidden' : 'block'} w-full pt-4`}
				>
					<div id="payment-element">
						<!-- Elements will create form elements here -->
					</div>
					<h3 class="pt-2">Billing Address</h3>
					<div id="billing-element" class="pt-2">
						<!-- Elements will create form elements here -->
					</div>
					<div id="error-message" class="text-error-600 py-1"></div>
					<div class="flex justify-end">
						<button
							id="pay-button"
							disabled={checkingOut}
							class={`btn btn--primary mt-2 ${priceID === null ? 'hidden' : ''}`}
							onclick={() => {
								trackingStore.trackAction('Subscribe Click');
							}}
						>
							Upgrade Account
						</button>
					</div>
					{#if checkingOut}
						<div class="fixed inset-0 z-50 flex items-center justify-center bg-gray-200/80">
							<Loader />
						</div>
					{/if}
				</form>
				{#if stripeCheckoutLoading}
					<div class="flex justify-center">
						<Loader />
					</div>
				{/if}
			</Card>
		</TwoColumn>
	{/if}
</PageContainer>
