<script lang="ts">
	import { PUBLIC_STRIPE_API_KEY } from '$env/static/public';
	import { useUpdateBilling } from '$lib/API/subscription';
	import Loader from '$lib/Components/Loader.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast';
	import { trackingStore } from '$lib/Stores/tracking';
	import {
		loadStripe,
		type Stripe,
		type StripeError,
		type StripeErrorType
	} from '@stripe/stripe-js';
	import { onMount } from 'svelte';

	let stripe: Stripe | null = null;
	let stripeCheckoutLoading: boolean = $state(true);
	let savingCC: boolean = $state(false);

	let updateBillingDetails = useUpdateBilling();

	onMount(async () => {
		stripe = await loadStripe(PUBLIC_STRIPE_API_KEY);
		trackingStore.pageViewEvent('Billing Settings');

		if (stripe) {
			const elements = stripe.elements({ clientSecret: await fetchClientSecret() });

			const paymentElement = elements.create('payment');

			// stripe.initCheckout({ fetchClientSecret }).then((checkout) => {
			// 	const paymentElement = checkout.createPaymentElement();
			paymentElement.mount('#payment-element');
			paymentElement.on('ready', function (event) {
				// Handle ready event
				stripeCheckoutLoading = false;
			});
			const button = document.getElementById('pay-button');
			const errors = document.getElementById('error-message');
			if (button) {
				button.addEventListener('click', async () => {
					savingCC = true;
					// Clear any validation errors
					if (errors) {
						errors.textContent = '';
					}
					try {
						const response = await elements.submit();
						console.log(response);
						if (response.error && errors) {
							errors.textContent = response.error.message || 'Could not update credit card';
						} else {
							toastStore.show({ message: 'Credit Card Updated' });
						}
					} catch (error) {
						if (errors) {
							errors.textContent = 'Could not update credit card';
						}
					} finally {
						savingCC = false;
					}
				});
			}
		}
	});

	async function fetchClientSecret() {
		let response = await $updateBillingDetails.mutateAsync();
		console.log({ response });
		return response;
	}
</script>

<form
	id="payment-form"
	class={`relative ${stripeCheckoutLoading ? 'hidden' : 'block'} w-full py-2`}
>
	<div id="payment-element">
		<!-- Elements will create form elements here -->
	</div>
	<div id="error-message" class="text-error-600 py-1"></div>
	<div class="flex justify-end">
		<button
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
