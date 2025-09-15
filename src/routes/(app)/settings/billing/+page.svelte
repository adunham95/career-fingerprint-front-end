<script lang="ts">
	import { PUBLIC_STRIPE_API_KEY } from '$env/static/public';
	import { useUpdateBilling } from '$lib/API/subscription';
	import Loader from '$lib/Components/Loader.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast';
	import { trackingStore } from '$lib/Stores/tracking';
	import { loadStripe, type Stripe, type StripeElements } from '@stripe/stripe-js';
	import { onMount } from 'svelte';

	let stripe: Stripe | null = null;
	let stripeCheckoutLoading: boolean = $state(true);
	let savingCC: boolean = $state(false);
	let elements: StripeElements | null = null;
	let clientSecret: string | null = null;

	let updateBillingDetails = useUpdateBilling();

	// onMount(async () => {
	// 	stripe = await loadStripe(PUBLIC_STRIPE_API_KEY);
	// 	trackingStore.pageViewEvent('Billing Settings');

	// 	let clientSecret = await fetchClientSecret();

	// 	if (stripe && clientSecret) {
	// 		const elements = stripe.elements({ clientSecret });

	// 		const paymentElement = elements.create('payment');
	// 		paymentElement.mount('#payment-element');
	// 		paymentElement.on('ready', function (event) {
	// 			// Handle ready event
	// 			stripeCheckoutLoading = false;
	// 		});
	// 		const button = document.getElementById('pay-button');
	// 		const errors = document.getElementById('error-message');
	// 		if (button) {
	// 			button.addEventListener('click', async () => {
	// 				savingCC = true;
	// 				// Clear any validation errors
	// 				if (errors) {
	// 					errors.textContent = '';
	// 				}
	// 				try {
	// 					const response = await elements.submit();
	// 					console.log(response);
	// 					if (response.error && errors) {
	// 						errors.textContent = response.error.message || 'Could not update credit card';
	// 					} else {
	// 						toastStore.show({ message: 'Credit Card Updated' });
	// 					}
	// 				} catch (error) {
	// 					if (errors) {
	// 						errors.textContent = 'Could not update credit card';
	// 					}
	// 				} finally {
	// 					savingCC = false;
	// 				}
	// 			});
	// 		}
	// 	}
	// });

	onMount(async () => {
		stripe = await loadStripe(PUBLIC_STRIPE_API_KEY);
		trackingStore.pageViewEvent('Billing Settings');

		clientSecret = await fetchClientSecret();

		if (stripe && clientSecret) {
			elements = stripe.elements({ clientSecret });
			const paymentElement = elements.create('payment');
			paymentElement.mount('#payment-element');

			paymentElement.on('ready', () => {
				stripeCheckoutLoading = false;
			});
		}
	});

	async function fetchClientSecret() {
		let response = await $updateBillingDetails.mutateAsync();
		console.log({ response });
		return response.checkoutSessionClientSecret; // ✅ extract the string
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!stripe || !elements || !clientSecret) return;

		savingCC = true;

		const errors = document.getElementById('error-message');

		// Step 1: Validate fields
		const { error: submitError } = await elements.submit();

		if (submitError) {
			if (errors) errors.textContent = submitError.message ?? 'Validation failed';
			savingCC = false;
			return;
		}

		const { error } = await stripe.confirmSetup({
			elements,
			clientSecret,
			confirmParams: {
				return_url: window.location.href // optional
			},
			redirect: 'if_required'
		});

		if (error) {
			if (errors) errors.textContent = error.message ?? 'Could not update credit card';
		} else {
			toastStore.show({ message: 'Credit Card Updated' });
		}

		savingCC = false;
	}
</script>

<form
	id="payment-form"
	class={`relative ${stripeCheckoutLoading ? 'hidden' : 'block'} w-full py-2`}
	onsubmit={handleSubmit}
>
	<div id="payment-element">
		<!-- Elements will create form elements here -->
	</div>
	<div id="error-message" class="text-error-600 py-1"></div>
	<div class="flex justify-end">
		<button
			type="submit"
			id="pay-button"
			class={`btn btn--primary mt-2`}
			disabled={savingCC}
			onclick={() => {
				trackingStore.trackAction('Update Credit Card Click');
			}}
		>
			Update Credit Card
		</button>
	</div>
	{#if savingCC}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-gray-200/80">
			<Loader />
		</div>
	{/if}
</form>
{#if stripeCheckoutLoading}
	<div class="flex justify-center py-2">
		<Loader />
	</div>
{/if}
