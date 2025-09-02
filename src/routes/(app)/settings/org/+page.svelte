<script lang="ts">
	import { PUBLIC_DEFAULT_ORG_KEY, PUBLIC_STRIPE_API_KEY } from '$env/static/public';
	import { useCreateOrg } from '$lib/API/org';
	import {
		useCreateCheckoutOrgSession,
		useGetEstimate,
		useGetPlanByID,
		type InvoiceEstimate
	} from '$lib/API/subscription';
	import BillingEstimate from '$lib/Components/BillingEstimate.svelte';
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import TwoColumn from '$lib/Components/Containers/TwoColumn.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
	import TextInputWAddOns from '$lib/Components/FormElements/TextInputWAddOns.svelte';
	import Loader from '$lib/Components/Loader.svelte';
	import { trackingStore } from '$lib/Stores/tracking';
	import { loadStripe, type Stripe } from '@stripe/stripe-js';
	import { onMount, untrack } from 'svelte';
	import type { Organization } from '../../../../app.js';

	const { data } = $props();

	let stripe: Stripe | null = null;

	onMount(async () => {
		stripe = await loadStripe(PUBLIC_STRIPE_API_KEY);
		trackingStore.pageViewEvent('New Org Settings');
	});

	let orgSize = $state(1);
	let orgName = $state('');
	let orgDomain = $state('');
	let orgEmail = $state('');

	let planData = useGetPlanByID(PUBLIC_DEFAULT_ORG_KEY || 'organization');
	let fetchOrderEstimate = useGetEstimate();
	let startCheckout = useCreateCheckoutOrgSession();
	let createOrgMutation = useCreateOrg();

	let formState = $state('details');

	let stripeCheckoutLoading: boolean = $state(false);
	let checkingOut = $state(false);

	let orderEstimate: null | InvoiceEstimate = $state(null);
	let priceID = $derived($planData?.data?.annualStripePriceID ?? null);

	let newOrg: Organization;

	$effect(() => {
		if (!priceID) {
			orderEstimate = null;
			return;
		}

		if (10000 < orgSize || orgSize <= 0) {
			orderEstimate = null;
			return;
		}

		untrack(async () => {
			try {
				orderEstimate = await $fetchOrderEstimate.mutateAsync({
					priceID,
					quantity: orgSize
				});
			} catch (err) {
				console.log('error', err);
				orderEstimate = null;
			} finally {
				// isLoading = false;
			}
		});
	});

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
						quantity: orgSize
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
				quantity: orgSize,
				couponID: undefined,
				orgID: newOrg?.id as string
			});
			console.log({ response });
			return response;
		}
		return '';
	}

	async function createNewOrg() {
		try {
			newOrg = await $createOrgMutation.mutateAsync({
				orgName,
				orgDomain,
				orgEmail,
				orgSize,
				admin: data.user.id
			});
			formState = 'payment';
			loadCheckout();
		} catch (error) {}
	}
</script>

<PageContainer className="divide-y divide-gray-300">
	<TwoColumn title={'New Organization information'}>
		{#snippet subSection()}
			<!-- {#if showBillingForm} -->
			<BillingEstimate
				discounts={orderEstimate?.discounts.map((d) => d.amount) || []}
				subTotal={orderEstimate?.subtotal || 0}
				taxes={orderEstimate?.tax.map((t) => t.amount) || []}
				total={orderEstimate?.total || 0}
			/>
			<!-- {/if} -->
		{/snippet}
		<Card className="md:col-span-2">
			<div class={`${formState === 'details' ? 'block' : 'hidden'}`}>
				<div class="mt-4 grid grid-cols-4 gap-x-4 gap-y-6">
					<TextInput
						bind:value={orgName}
						id="name"
						label="Organization Name"
						className="col-span-4"
					/>
					<TextInput
						bind:value={orgSize}
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
			<div class={`${formState === 'payment' ? 'block' : 'hidden'}`}>
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
			{#snippet actions()}
				<button
					onclick={createNewOrg}
					class={`btn btn--primary ${formState === 'details' ? 'block' : 'hidden'}`}
					>Create Account</button
				>

				<button
					id="pay-button"
					disabled={checkingOut}
					class={`btn btn--primary  ${formState === 'payment' ? 'block' : 'hidden'}`}
				>
					Start Subscription
				</button>
			{/snippet}
		</Card>
	</TwoColumn>
</PageContainer>
