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
	import { onMount } from 'svelte';
	import OnboardSteps from '../OnboardSteps.svelte';

	const currentUserBillingStatus = useGetCurrentUserBillingStatus();

	const { data } = $props();

	console.log({ data });

	let stripe: Stripe | null = null;
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
								trackingStore.trackAction('Register User Subscription Success');
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
		<OnboardSteps step={3} />
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
					<button class="text-sm" onclick={() => (showPromoCode = !showPromoCode)}
						>Have a promo code?</button
					>
					<div class={` ${showPromoCode ? 'block' : 'hidden'}`}>
						<DiscountCodeInput
							bind:promoID
							promoValidated={() => priceID && updateStripe(priceID)}
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
				class={`btn btn-text--primary ${priceID === null ? 'hidden' : ''}`}
				onclick={() => {
					trackingStore.trackAction('Register User Subscription Click');
				}}
			>
				Create Account
			</button>
		{/snippet}
	</Card>
{:else}
	<Loader />
{/if}
