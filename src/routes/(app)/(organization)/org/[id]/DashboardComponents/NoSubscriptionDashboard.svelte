<script lang="ts">
	import { PUBLIC_CONTACT_SALES, PUBLIC_STRIPE_API_KEY } from '$env/static/public';
	import { useCreateCheckoutClientSession, useGetPlansByType } from '$lib/API/subscription';
	import Card from '$lib/Components/Containers/Card.svelte';
	import Loader from '$lib/Components/Loader.svelte';
	import { trackingStore } from '$lib/Stores/tracking';
	import { centsToDollars } from '$lib/Utils/centsToDollars';
	import { loadStripe, type Stripe, type StripeCheckout } from '@stripe/stripe-js';
	import { onMount } from 'svelte';

	const plans = useGetPlansByType('coach');
	const startCheckout = useCreateCheckoutClientSession();

	let stripe: Stripe | null = null;
	let stripeCheckout: StripeCheckout | null = null;
	let priceID: string | null = $state(null);
	let showBillingForm: boolean = $state(false);
	let stripeCheckoutLoading: boolean = $state(false);
	let checkingOut = $state(false);

	let selectedPlan = $state<string | null>(null);

	const { orgID }: { orgID: string } = $props();

	onMount(async () => {
		stripe = await loadStripe(PUBLIC_STRIPE_API_KEY);
	});

	async function updateStripe(newPriceID: string) {
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
		console.log('priceID', priceID);
		if (priceID) {
			let response = await $startCheckout.mutateAsync({
				planID: selectedPlan || '',
				orgID: orgID || ''
				// couponID: promoID || undefined
			});
			console.log({ response });
			return response.checkoutSessionClientSecret;
		}
		return '';
	}

	$inspect($plans.data);
</script>

<fieldset class="">
	<legend class="pt-6 text-lg font-semibold text-gray-900">Select a plan</legend>
	{#if $plans.isLoading}
		<div class="flex justify-center">
			<Loader />
		</div>
	{/if}
	<div class="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
		{#each $plans.data as plan}
			<label
				class="group has-checked:outline-primary bg-surface-50 relative flex rounded-lg border-3 border-gray-900/5 p-4 shadow-xs ring-gray-900/5 has-checked:outline-2 has-checked:-outline-offset-2 has-focus-visible:outline-3 has-focus-visible:-outline-offset-1 has-disabled:border-gray-400 has-disabled:bg-gray-200 has-disabled:opacity-25 sm:rounded-xl"
			>
				<input
					type="radio"
					name="plan-selector"
					value={plan.id}
					checked={selectedPlan === plan.id}
					onchange={() => {
						selectedPlan = plan.id;
						priceID = plan.monthlyStripePriceID;
						updateStripe(plan.monthlyStripePriceID || '');
					}}
					class="sr-only absolute inset-0 appearance-none focus:outline-none"
				/>
				<div class="flex-1">
					<span class="block text-base font-medium text-gray-900">{plan.name}</span>
					<div class=" flex items-center gap-x-2 font-medium text-gray-500">
						<span class="font-medium">${centsToDollars(plan.priceCents)} / mo</span>
						{#if plan.priceCentsSeats}
							<span class="font-medium"> + </span>
							<span class="font-medium">
								${centsToDollars(plan.priceCentsSeats)} / client / mo
							</span>
						{/if}
					</div>
					<span class="mt-1 block text-sm text-gray-500">{plan.description}</span>
					<div class="mt-2 flex items-center gap-x-2 text-sm font-medium text-gray-500">
						<span class=" block">{plan.maxSeats} Max Clients</span>
						<span class="block">
							<svg viewBox="0 0 2 2" class="size-0.5 fill-current">
								<circle r="1" cx="1" cy="1" />
							</svg>
						</span>
						<span class="block">{plan.maxAdminSeats} Max Admin(s)</span>
					</div>
					<div class="mt-2">
						<span class="btn btn-small btn--primary my-2">Select {plan.name}</span>
					</div>
				</div>
				<svg
					viewBox="0 0 20 20"
					fill="currentColor"
					data-slot="icon"
					aria-hidden="true"
					class="text-primary invisible size-5 group-has-checked:visible"
				>
					<path
						d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
						clip-rule="evenodd"
						fill-rule="evenodd"
					/>
				</svg>
			</label>
		{/each}
	</div>
</fieldset>

<Card className="my-4">
	<div
		class="flex flex-col items-start gap-x-8 gap-y-6 rounded-3xl sm:gap-y-10 lg:col-span-2 lg:flex-row lg:items-center"
	>
		<div class="lg:min-w-0 lg:flex-1">
			<h3 class="text-base/7 font-semibold text-gray-700">Larger Organization</h3>
			<p class="mt-1 text-base/7 text-gray-600">
				Custom solutions for universities, workforce programs, and enterprise teams needing higher
				capacity, SSO, and dedicated support.
			</p>
		</div>
		<a href={PUBLIC_CONTACT_SALES} target="_blank" class="btn btn-outline--primary">
			Contact Our Sales Team <span aria-hidden="true">&rarr;</span>
		</a>
	</div>
</Card>

<form id="payment-form" class={`relative ${!showBillingForm ? 'hidden' : 'block'} w-full`}>
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
