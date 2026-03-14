<script lang="ts">
	import { PUBLIC_STRIPE_API_KEY } from '$env/static/public';
	import {
		useCreateCheckoutSession,
		useGetEstimate,
		type InvoiceEstimate
	} from '$lib/API/subscription';
	import { useGetCurrentUserBillingStatus } from '$lib/API/user';
	import BillingEstimate from '$lib/Components/BillingEstimate.svelte';
	import Card from '$lib/Components/Containers/Card.svelte';
	import DiscountCodeInput from '$lib/Components/DiscountCodeInput.svelte';
	import StripeCheckout from '$lib/Components/Forms/StripeCheckout.svelte';
	import Loader from '$lib/Components/Loader.svelte';
	import { trackingStore } from '$lib/Stores/tracking';
	import { centsToDollars } from '$lib/Utils/centsToDollars';
	import { loadStripe, type Stripe } from '@stripe/stripe-js';
	import { onMount, tick } from 'svelte';
	import OnboardSteps from '../OnboardSteps.svelte';

	const currentUserBillingStatus = useGetCurrentUserBillingStatus();

	const { data } = $props();

	console.log({ data });

	let stripe: Stripe | null = $state(null);
	let stripeCheckout: StripeCheckout | null = null;
	let priceID: string | null = $state(null);
	let planType: 'annual' | 'monthly' = $state('monthly');
	let promoID: string | null = $state(null);
	let showBillingForm: boolean = $state(false);
	let stripeCheckoutLoading: boolean = $state(false);
	let checkingOut = $state(false);
	let orderEstimate = $state<null | InvoiceEstimate>(null);
	let showPromoCode = $state(false);

	const startCheckout = useCreateCheckoutSession();
	const orderEstimateCall = useGetEstimate();

	onMount(async () => {
		stripe = await loadStripe(PUBLIC_STRIPE_API_KEY);
		trackingStore.pageViewEvent('Onboard Membership');
	});

	$effect(() => {
		if (
			stripe &&
			!priceID &&
			data.availablePlans?.monthlyStripePriceID &&
			$currentUserBillingStatus.isFetched
		) {
			updateStripe(data.availablePlans.monthlyStripePriceID);
		}
	});

	async function updateStripe(newPriceID: string) {
		priceID = newPriceID;
		orderEstimate = await $orderEstimateCall.mutateAsync({ promoID, priceID: newPriceID });
		stripeCheckoutLoading = true;
		if (!showBillingForm) {
			trackingStore.trackAction('Onboard Membership - Billing Form Shown', { planType });
		}
		showBillingForm = true;
		await tick();
		if (stripe) {
			console.log('initilizting checkout');
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
</script>

{#if $currentUserBillingStatus.isFetched}
	<Card
		headline="Start Your Free Trial"
		className=" w-full max-w-[500px] md:max-h-[calc(100vh-160px)] md:my-4 md:mx-2 overflow-y-auto"
		contentClassName="space-y-3"
	>
		<OnboardSteps step={2} />
		{#if data.availablePlans}
			<div class={`pt-4`}>
				<p class="pb-2 text-center text-sm font-semibold text-gray-400">
					14 days free — no charge until your trial ends. Cancel any time.
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
							<p class="text-sm font-semibold text-gray-600">ANNUAL</p>
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
								checked={planType === 'monthly'}
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
								trackingStore.trackAction('Onboard Membership - Promo Code Applied', {
									plan_type: planType
								});
								if (priceID) updateStripe(priceID);
							}}
						/>
					</div>
				</div>
			</div>
			{#if orderEstimate}
				<BillingEstimate
					discounts={orderEstimate?.discounts.map((d) => d.amount) || []}
					subTotal={orderEstimate?.subtotal || 0}
					taxes={orderEstimate?.tax.map((t) => t.amount) || []}
					total={orderEstimate?.total || 0}
					trialDays={14}
					postTrialLabel={`then $${centsToDollars(orderEstimate.total)}/${planType === 'annual' ? 'yr' : 'mo'}`}
				/>
			{:else if $orderEstimateCall.isPending}
				<div class="flex justify-center">
					<Loader />
				</div>
			{/if}
			<form id="payment-form" class={`relative ${!showBillingForm ? 'hidden' : 'block'} w-full`}>
				<div id="payment-element">
					<!-- Elements will create form elements here -->
				</div>
				<h3 class="pt-2">Billing Address</h3>
				<div id="billing-element" class="pt-2">
					<!-- Elements will create form elements here -->
				</div>
				<div id="error-message" class="text-error-600 py-1"></div>

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
		{/if}
		{#snippet actions()}
			<button
				id="pay-button"
				disabled={checkingOut}
				class={`btn btn--primary w-full ${priceID === null ? 'hidden' : ''}`}
				onclick={() => {
					trackingStore.trackAction('Register User Subscription Click');
				}}
			>
				Create Account
			</button>
		{/snippet}
	</Card>
{:else}
	<Card headline="Loading payment options...">
		<div class="flex flex-col items-center justify-center py-8 text-center">
			<div class="bg-primary/10 mb-4 flex h-14 w-14 items-center justify-center rounded-full">
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
			<p class="text-sm text-gray-600">Connecting securely, just a moment...</p>
			<div class="mt-4 flex gap-1">
				<span class="bg-primary/40 h-2 w-2 animate-bounce rounded-full" style="animation-delay: 0ms"
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
	</Card>
{/if}
