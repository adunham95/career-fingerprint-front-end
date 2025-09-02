<script lang="ts">
	import { PUBLIC_DEFAULT_ORG_KEY, PUBLIC_STRIPE_API_KEY } from '$env/static/public';
	import { useRegisterOrg } from '$lib/API/org';
	import {
		useCreateCheckoutOrgSession,
		useGetEstimate,
		useGetPlanByID,
		type InvoiceEstimate
	} from '$lib/API/subscription';
	import BillingEstimate from '$lib/Components/BillingEstimate.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
	import TextInputWAddOns from '$lib/Components/FormElements/TextInputWAddOns.svelte';
	import Loader from '$lib/Components/Loader.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast';
	import { trackingStore } from '$lib/Stores/tracking';
	import { loadStripe, type Stripe } from '@stripe/stripe-js';
	import { onMount, untrack } from 'svelte';
	import type { Organization } from '../../../../app';

	let stripe: Stripe | null = null;

	onMount(async () => {
		stripe = await loadStripe(PUBLIC_STRIPE_API_KEY);
		trackingStore.pageViewEvent('Get Started Org');
	});

	let groupSize = $state(1);
	let planData = useGetPlanByID(PUBLIC_DEFAULT_ORG_KEY || 'organization');
	let fetchOrderEstimate = useGetEstimate();
	let createOrgAndUser = useRegisterOrg();
	let startCheckout = useCreateCheckoutOrgSession();

	let stripeCheckoutLoading: boolean = $state(false);
	let checkingOut = $state(false);

	let newOrg: Organization;

	$inspect($planData.data);

	let orderEstimate: null | InvoiceEstimate = $state(null);
	let priceID = $derived($planData?.data?.annualStripePriceID ?? null);

	$effect(() => {
		if (!priceID) {
			orderEstimate = null;
			return;
		}

		if (10000 < groupSize || groupSize <= 0) {
			orderEstimate = null;
			return;
		}

		untrack(async () => {
			try {
				orderEstimate = await $fetchOrderEstimate.mutateAsync({
					priceID,
					quantity: groupSize
				});
			} catch (err) {
				console.log('error', err);
				orderEstimate = null;
			} finally {
				// isLoading = false;
			}
		});
	});

	let orgName = $state('');
	let orgDomain = $state('');
	let orgEmail = $state('');

	let firstName = $state('');
	let lastName = $state('');
	let email = $state('');
	let password = $state('');

	let formState = $state('details');

	async function createUser() {
		try {
			// TODO Validation

			const { org } = await $createOrgAndUser.mutateAsync({
				firstName,
				lastName,
				email,
				password,
				orgDomain,
				orgEmail,
				orgName,
				orgSize: groupSize
			});
			newOrg = org;

			loadCheckout();
			formState = 'payment';
		} catch (error) {
			toastStore.show({ message: 'Error Creating Organization And User' });
		}
	}

	async function loadCheckout() {
		if (stripe) {
			stripe.initCheckout({ fetchClientSecret }).then((checkout) => {
				console.log({ checkout });
				const paymentElement = checkout.createPaymentElement();
				const billingAddressElement = checkout.createBillingAddressElement();
				paymentElement.mount('#payment-element');
				billingAddressElement.mount('#billing-element');
				billingAddressElement.on('change', async () => {
					orderEstimate = await $fetchOrderEstimate.mutateAsync({
						priceID,
						quantity: groupSize
					});
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
				quantity: groupSize,
				couponID: undefined,
				orgID: newOrg.id
			});
			console.log({ response });
			return response;
		}
		return '';
	}
</script>

<div class="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
	<h2 class="sr-only">Checkout</h2>

	<div class="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
		<div>
			<div class={`${formState === 'details' ? 'block' : 'hidden'}`}>
				<h2 class="text-lg font-medium text-gray-900">Organization information</h2>

				<div class="mt-4 grid grid-cols-4 gap-x-4 gap-y-6">
					<TextInput
						bind:value={orgName}
						id="name"
						label="Organization Name"
						className="col-span-4"
					/>
					<TextInput
						bind:value={groupSize}
						className="col-span-2"
						id="group-size"
						placeholder="Enter your group size"
						subLabel="Select the number of seats your would like"
						label="Group Size"
						type="number"
					/>
					<TextInputWAddOns
						preInlineText="example@"
						bind:value={orgDomain}
						className="col-span-2"
						id="org-domain"
						label="Org Domain"
					/>
					<TextInput
						id="org-email"
						bind:value={orgEmail}
						label="Organization Email"
						subLabel="Used for organization communication and billing"
						className="col-span-4"
						type="email"
					/>
				</div>
			</div>

			<div
				class={`mt-10 border-t border-gray-200 pt-10  ${formState === 'details' ? 'block' : 'hidden'}`}
			>
				<h2 class="text-lg font-medium text-gray-900">User information</h2>

				<div class="mt-4 grid grid-cols-4 gap-x-4 gap-y-6">
					<TextInput
						id="email"
						bind:value={email}
						label="Email"
						className="col-span-4"
						type="email"
					/>
					<TextInput
						id="firstName"
						bind:value={firstName}
						label="First Name"
						className="col-span-2"
					/>
					<TextInput id="lastName" bind:value={lastName} label="Last Name" className="col-span-2" />
					<TextInput id="password" bind:value={password} label="Password" className="col-span-2" />
				</div>
			</div>
			<!-- Payment -->
			<div
				class={`mt-10 border-t border-gray-200 pt-10 ${formState === 'payment' ? 'block' : 'hidden'}`}
			>
				<h2 class="text-lg font-medium text-gray-900">Payment</h2>
				<div id="payment-element">
					<!-- Elements will create form elements here -->
				</div>
				<h3 class="pt-2">Billing Address</h3>
				<div id="billing-element" class="pt-2">
					<!-- Elements will create form elements here -->
				</div>
			</div>
			{#if stripeCheckoutLoading}
				<div class="flex justify-center">
					<Loader />
				</div>
			{/if}
		</div>

		<!-- Order summary -->
		<div class="mt-10 lg:mt-0">
			<h2 class="text-lg font-medium text-gray-900">Order summary</h2>

			<div class="mt-4 rounded-lg border border-gray-200 bg-white shadow-xs">
				{#if groupSize >= 10000}
					<div class="px-4 py-6 sm:px-6">
						<p>
							For organizations that want more than 10,000 seats please contact our sales team at <a
								class="text-primary"
								href="mailto:emelie@career-fingerprint.com">emelie@career-fingerprint.com</a
							> to get a custom quote.
						</p>
					</div>
				{:else}
					<h3 class="sr-only">Items in your cart</h3>

					<div class="border-t border-gray-200 px-4 py-6 sm:px-6">
						<BillingEstimate
							lineItems={orderEstimate?.lineItems}
							discounts={orderEstimate?.discounts.map((d) => d.amount) || []}
							subTotal={orderEstimate?.subtotal || 0}
							taxes={orderEstimate?.tax.map((t) => t.amount) || []}
							total={orderEstimate?.total || 0}
						/>
					</div>

					<div class="border-t border-gray-200 px-4 py-6 sm:px-6">
						<button
							onclick={() => createUser()}
							class={`btn btn--primary w-full ${formState === 'details' ? 'block' : 'hidden'}`}
							>Create Account</button
						>

						<button
							id="pay-button"
							disabled={checkingOut}
							class={`btn btn--primary w-full ${formState === 'payment' ? 'block' : 'hidden'}`}
						>
							Start Subscription
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
