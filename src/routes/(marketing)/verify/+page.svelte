<script lang="ts">
	import { goto } from '$app/navigation';
	import { useCreateSubscription, useCreateSubscriptionTrial } from '$lib/API/subscription';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import Loader from '$lib/Components/Loader.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast.js';
	import { trackingStore } from '$lib/Stores/tracking';
	import { centsToDollars } from '$lib/Utils/centsToDollars';

	const { data } = $props();

	console.log({ data });

	let startSubscriptionTrial = useCreateSubscriptionTrial();
	let startSubscription = useCreateSubscription();

	async function startManagedSubscription() {
		try {
			if (!data?.tokenDetails?.plan) throw 'Missing Plans';
			let newSubscription = await $startSubscription.mutateAsync({
				planID: data.tokenDetails.plan.id || '',
				orgID: data.tokenDetails.orgID
			});

			toastStore.show({
				type: 'success',
				message: `Account Created`
			});
			goto('/dashboard');
		} catch (error) {
			toastStore.show({
				type: 'error',
				message: `Error subscription`
			});
		}
	}

	async function startFreeTrial() {
		try {
			if (!data.tokenDetails?.plan) throw 'Missing Plans';
			if (!data.tokenDetails.plan.monthlyStripePriceID) throw 'Missing Monthly Price ID';
			let newSubscription = $startSubscriptionTrial.mutateAsync({
				priceID: data.tokenDetails.plan.monthlyStripePriceID,
				planID: data.tokenDetails.plan.id || ''
			});
			toastStore.show({
				type: 'success',
				message: `Free trial started`
			});
			goto('/dashboard');
		} catch (error) {
			toastStore.show({
				type: 'error',
				message: `Error creating free trial`
			});
		}
	}
</script>

<PageContainer>
	<div class="py-12">
		<div class="mx-auto max-w-2xl text-center">
			{#if data.tokenDetails?.verified}
				<h2 class="mt-2 text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
					Your email has been verified.
				</h2>
			{:else}
				<h2 class="mt-2 text-4xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
					We could not verify your email. Please try again later.
				</h2>
			{/if}

			{#if data.tokenDetails?.plan}
				<p class="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
					Below you can sign for a free trial
				</p>
			{/if}
		</div>
	</div>
	{#if data.tokenDetails?.plan}
		<div
			class="bg-surface-50 relative mx-auto mt-8 w-full rounded-3xl ring-1 ring-gray-200 sm:mt-10 lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-3"
		>
			{#if $startSubscriptionTrial.isPending || $startSubscription.isPending}
				<div
					class="absolute inset-0 flex items-center justify-center rounded-3xl bg-gray-600/40 shadow-2xl"
				>
					<Loader size="md" />
				</div>
			{/if}
			<div class="p-8 sm:p-10 lg:col-span-2">
				<h3 class="text-3 font-semibold tracking-tight text-gray-900">
					{data.tokenDetails.plan.name}
				</h3>
				<p class="mt-6 text-base/7 text-gray-600">
					{data.tokenDetails.plan.description}
				</p>
				<div class="mt-5 flex items-center gap-x-4">
					<h4 class="text-primary flex-none font-semibold">What’s included</h4>
					<div class="h-px flex-auto bg-gray-300"></div>
				</div>
				<ul role="list" class="mt-8 grid grid-cols-1 gap-4 text-gray-600 sm:gap-6">
					{#each data.tokenDetails.plan.featureList as feature}
						<li class="flex gap-x-3">
							<svg
								viewBox="0 0 20 20"
								fill="currentColor"
								data-slot="icon"
								aria-hidden="true"
								class="text-primary h-6 w-5 flex-none"
							>
								<path
									d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
									clip-rule="evenodd"
									fill-rule="evenodd"
								/>
							</svg>
							{feature}
						</li>
					{/each}
				</ul>
			</div>
			<div class="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:shrink-0">
				<div
					class="bg-surface-200 h-full rounded-2xl py-10 text-center ring-1 ring-gray-900/5 ring-inset lg:flex lg:flex-col lg:justify-center lg:py-16"
				>
					<div class="mx-auto max-w-xs px-8">
						{#if data.tokenDetails.orgID}
							<p class="text-sm">
								Good news! {data.tokenDetails.orgName} provides Premium at no cost
							</p>
						{/if}
						<p class="mt-6 flex items-baseline justify-center gap-x-2">
							<span
								class={`text-1 font-semibold tracking-tight text-gray-900 ${data.tokenDetails.orgID ? 'line-through' : ''} `}
								>${centsToDollars(data.tokenDetails.plan.priceCents)}</span
							>
							{#if data.tokenDetails.orgID}
								<span class="text-1 font-semibold tracking-tight text-gray-900">Free</span>
							{/if}
							<span class="text-4 font-semibold tracking-wide text-gray-600">/month</span>
						</p>
						{#if data.tokenDetails.orgID}
							<button
								disabled={$startSubscriptionTrial.isPending || $startSubscription.isPending}
								class="btn btn--primary mt-10 block w-full"
								onclick={() => {
									startManagedSubscription();
									trackingStore.trackAction('Sign up with org');
								}}
							>
								Sign Up with {data.tokenDetails.orgName}
							</button>
							<button
								disabled={$startSubscriptionTrial.isPending || $startSubscription.isPending}
								class="btn btn-outline--primary mt-1 block w-full"
								onclick={() => {
									startFreeTrial();
									trackingStore.trackAction('Start Free Personal Trial Click');
								}}
							>
								Start my personal free trial
							</button>
						{:else}
							<button
								disabled={$startSubscriptionTrial.isPending || $startSubscription.isPending}
								onclick={() => {
									startFreeTrial();
									trackingStore.trackAction('Start Free Trial Click');
								}}
								class="btn btn--primary mt-10 block w-full"
							>
								Start my free trial
							</button>
						{/if}
					</div>
				</div>
			</div>
		</div>
		<div class="mt-2 flex w-full justify-end">
			<a
				href="/dashboard"
				onclick={() =>
					trackingStore.trackAction('Next Step Click', {
						step: 'Go To Account'
					})}
				class=" text-small btn btn-text--secondary btn-small">Continue without Premium Benefits</a
			>
		</div>
	{:else}
		<div class="flex justify-center">
			<a
				href="/dashboard"
				class="btn btn--primary my-10 block"
				onclick={() =>
					trackingStore.trackAction('Next Step Click', {
						step: 'Go To Account'
					})}>Go to my account</a
			>
		</div>
	{/if}
</PageContainer>
