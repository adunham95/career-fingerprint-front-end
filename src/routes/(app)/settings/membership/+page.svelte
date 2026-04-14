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
	import { onMount, tick } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { trackingStore } from '$lib/Stores/tracking.js';
	import Loader from '$lib/Components/Loader.svelte';
	import DiscountCodeInput from '$lib/Components/DiscountCodeInput.svelte';
	import BillingEstimate from '$lib/Components/BillingEstimate.svelte';
	import MembershipStatusBadge from '$lib/Components/MembershipStatusBadge.svelte';

	const { data } = $props();
	console.log({ data });

	let stripe: Stripe | null = $state(null);
	let stripeCheckout: StripeCheckout | null = null;
	let priceID: string | null = $state(null);
	let promoID: string | null = $state(null);
	let showBillingForm: boolean = $state(false);
	let stripeCheckoutLoading: boolean = $state(false);
	let checkingOut = $state(false);
	let orderEstimate = $state<null | InvoiceEstimate>(null);
	let pendingClientSecret: Promise<string> | null = null;
	let planType: 'annual' | 'monthly' = $state('monthly');
	let showPromoCode = $state(false);

	const startCheckout = useCreateCheckoutSession();
	const cancelMembershipMutation = useCancelSubscription();
	const orderEstimateCall = useGetEstimate();

	onMount(async () => {
		stripe = await loadStripe(PUBLIC_STRIPE_API_KEY);
		trackingStore.pageViewEvent('Membership Settings');
	});

	$effect(() => {
		console.log('set default', {
			stripe,
			priceID: !priceID,
			monthlyPlan: data.availablePlans?.monthlyStripePriceID
		});
		if (stripe && !priceID && data.availablePlans?.monthlyStripePriceID) {
			stripeCheckoutLoading = true;
			updateStripe(data.availablePlans.monthlyStripePriceID);
		}
	});

	async function updateStripe(newPriceID: string) {
		stripeCheckoutLoading = true;
		priceID = newPriceID;
		// Kick off checkout session creation immediately — runs in parallel with estimate
		pendingClientSecret = $startCheckout.mutateAsync({
			priceID: newPriceID,
			planID: data.availablePlans?.id || '',
			couponID: promoID || undefined
		});
		orderEstimate = await $orderEstimateCall.mutateAsync({ promoID, priceID: newPriceID });
		if (!showBillingForm) {
			trackingStore.trackAction('Onboard Membership - Billing Form Shown', { planType });
		}
		showBillingForm = true;
		await tick();
		if (stripe) {
			console.log('initializing checkout');
			stripe.initCheckout({ fetchClientSecret }).then((checkout) => {
				console.log({ checkout });
				const paymentElement = checkout.createPaymentElement();
				const billingAddressElement = checkout.createBillingAddressElement();
				paymentElement.mount('#payment-element');
				billingAddressElement.mount('#billing-element');
				billingAddressElement.on('change', async () => {
					orderEstimate = await $orderEstimateCall.mutateAsync({ promoID, priceID: newPriceID });
				});
				paymentElement.on('ready', function () {
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
								trackingStore.trackAction('Register User Subscription Error', {
									error: result.error.message,
									plan_type: planType
								});
							}
							if (result.type === 'success') {
								console.log(result.session.id);
								trackingStore.trackAction('Register User Subscription Success', {
									plan_type: planType
								});
							}
							checkingOut = false;
						});
					});
				}
			});
		}
	}

	async function fetchClientSecret() {
		if (pendingClientSecret) {
			return pendingClientSecret;
		}
		if (priceID) {
			return $startCheckout.mutateAsync({
				priceID,
				planID: data.availablePlans?.id || '',
				couponID: promoID || undefined
			});
		}
		return '';
	}

	async function cancelMembership() {
		try {
			await $cancelMembershipMutation.mutateAsync(data.membershipDetails?.id || '');
			invalidateAll();
			toastStore.show({ message: 'Canceled Subscription', type: 'success' });
		} catch (error) {
			toastStore.show({
				message: 'Could not cancel your subscription. Try again or contact support.',
				type: 'error'
			});
		}
	}

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
		<TwoColumn title={'Upgrade Your Account'}>
			{#snippet subSection()}
				{#if orderEstimate}
					<BillingEstimate
						lineItems={orderEstimate.lineItems.map((item) => ({
							...item,
							description: 'Monthly plan'
						}))}
						discounts={orderEstimate?.discounts.map((d) => d.amount) || []}
						subTotal={orderEstimate?.subtotal || 0}
						taxes={orderEstimate?.tax.map((t) => t.amount) || []}
						total={orderEstimate?.total || 0}
					/>
				{:else if !$orderEstimateCall.isIdle}
					<div class="flex justify-center">
						<Loader />
					</div>
				{/if}
			{/snippet}
			<Card
				className="md:col-span-2  rounded-2xl bg-gray-50  ring-3 ring-gray-900/5 ring-inset lg:flex lg:flex-col lg:justify-center "
			>
				<div>
					<p class="text-center text-lg font-semibold text-gray-600">{data.availablePlans.name}</p>
					<p class="text-center text-base font-semibold text-gray-600">
						Select a billing type to get started
					</p>
					<div class="grid gap-4 pt-2 md:grid-cols-2">
						{#if data.availablePlans.annualStripePriceID !== null}
							<label
								class="has-[:checked]:border-primary relative cursor-pointer rounded border-2 border-gray-200 p-4 transition-colors"
							>
								<input
									type="radio"
									name="billing-cycle"
									value={data.availablePlans.annualStripePriceID}
									class="sr-only"
									checked={data.availablePlans.annualStripePriceID === priceID}
									onchange={() => {
										priceID = data.availablePlans?.annualStripePriceID || null;
										planType = 'annual';
										updateStripe(data.availablePlans?.annualStripePriceID || '');
										trackingStore.trackAction('Yearly Plan Click', {
											type: 'Yearly',
											planKey: data.availablePlans?.key || ''
										});
									}}
								/>
								<p class="font-title mt-2 gap-x-2">
									<span class="text-3xl font-semibold tracking-tight text-gray-900">
										${centsToDollars(data.availablePlans.priceCentsYear)}
									</span>
									<span class="text-sm/6 font-semibold tracking-wide text-gray-600">/year</span>
								</p>
								<p class="text-sm font-semibold text-gray-600">
									ANNUAL
									<span class=" text-caption">(2 months free)</span>
								</p>
							</label>
						{/if}
						{#if data.availablePlans.monthlyStripePriceID}
							<label
								class="has-[:checked]:border-primary relative cursor-pointer rounded border-2 border-gray-200 p-4 transition-colors"
							>
								<input
									type="radio"
									name="billing-cycle"
									value={data.availablePlans.monthlyStripePriceID}
									class="sr-only"
									checked={data.availablePlans.monthlyStripePriceID === priceID}
									onchange={() => {
										priceID = data.availablePlans?.monthlyStripePriceID || '';
										planType = 'monthly';
										updateStripe(data.availablePlans?.monthlyStripePriceID || '');
										trackingStore.trackAction('Monthly Plan Click', {
											type: 'Monthly',
											planKey: data.availablePlans?.key || ''
										});
									}}
								/>
								<p class="font-title mt-2 gap-x-2">
									<span class="text-3xl font-semibold tracking-tight text-gray-900">
										${centsToDollars(data.availablePlans.priceCents)}
									</span>
									<span class="text-sm/6 font-semibold tracking-wide text-gray-600">/mo</span>
								</p>
								<p class="text-sm font-semibold text-gray-600">MONTHLY</p>
							</label>
						{/if}
					</div>

					<!-- <div>
						<h2>You Get</h2>
						<ul>
							{#each data.availablePlans.featureList as feature}
								<li>{feature}</li>
							{/each}
						</ul>
					</div> -->

					<div class="w-full pt-4">
						<button
							class="text-sm"
							onclick={() => {
								showPromoCode = !showPromoCode;
								if (showPromoCode) {
									trackingStore.trackAction('Onboard Membership - Promo Code Opened', {
										plan_type: planType
									});
								}
							}}>Have a promo code?</button
						>
						<div class={` ${showPromoCode ? 'block' : 'hidden'}`}>
							<DiscountCodeInput
								bind:promoID
								promoValidated={() => {
									trackingStore.trackAction('Promo Code Applied', {
										plan_type: planType
									});
									if (priceID) updateStripe(priceID);
								}}
							/>
						</div>
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
							Start {data.availablePlans.name}
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
						<div class="flex flex-col items-center justify-center py-8 text-center">
							<div
								class="bg-primary/10 mb-4 flex h-14 w-14 items-center justify-center rounded-full"
							>
								<svg
									class="text-primary h-7 w-7"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="2"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
									/>
								</svg>
							</div>
							<h3 class="font-title text-secondary mb-2 text-2xl font-normal">
								Loading payment options...
							</h3>
							<p class="text-sm text-gray-600">Connecting securely, just a moment...</p>
							<div class="mt-4 flex gap-1">
								<span
									class="bg-primary/40 h-2 w-2 animate-bounce rounded-full"
									style="animation-delay: 0ms"
								></span>
								<span
									class="bg-primary/40 h-2 w-2 animate-bounce rounded-full"
									style="animation-delay: 150ms"
								></span>
								<span
									class="bg-primary/40 h-2 w-2 animate-bounce rounded-full"
									style="animation-delay: 300ms"
								></span>
							</div>
						</div>
					</div>
				{/if}
			</Card>
		</TwoColumn>
	{/if}
</PageContainer>
