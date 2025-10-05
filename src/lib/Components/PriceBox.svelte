<script lang="ts">
	import { trackingStore } from '$lib/Stores/tracking';
	import { centsToDollars } from '$lib/Utils/centsToDollars';
	import Loader from './Loader.svelte';

	interface Props {
		isLoading?: boolean;
		name: string;
		description: string;
		featureList: string[];
		priceCents: number;
		orgName?: string;
		priceOverride?: number;
		startFreeTrial: () => void;
		startManagedSubscription?: () => void;
	}

	const {
		isLoading = false,
		name,
		description,
		featureList,
		priceCents,
		orgName,
		priceOverride,
		startFreeTrial,
		startManagedSubscription
	}: Props = $props();
</script>

<div
	class="bg-surface-50 relative mx-auto mt-8 w-full rounded-3xl ring-1 ring-gray-200 sm:mt-10 lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-3"
>
	{#if isLoading}
		<div
			class="absolute inset-0 flex items-center justify-center rounded-3xl bg-gray-600/40 shadow-2xl"
		>
			<Loader size="md" />
		</div>
	{/if}
	<div class="p-8 sm:p-10 lg:col-span-2">
		<h3 class="text-3 font-semibold tracking-tight text-gray-900">
			{name}
		</h3>
		<p class="mt-6 text-base/7 text-gray-600">
			{description}
		</p>
		<div class="mt-5 flex items-center gap-x-4">
			<h4 class="text-primary flex-none font-semibold">What’s included</h4>
			<div class="h-px flex-auto bg-gray-300"></div>
		</div>
		<ul role="list" class="mt-8 grid grid-cols-1 gap-4 text-gray-600 sm:gap-6">
			{#each featureList as feature}
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
				{#if orgName}
					<p class="text-sm">
						Good news! {orgName} provides Premium at no cost
					</p>
				{/if}
				<p class="mt-6 flex items-baseline justify-center gap-x-2">
					<span
						class={`text-1 font-semibold tracking-tight text-gray-900 ${priceOverride ? 'line-through' : ''} `}
						>${centsToDollars(priceCents)}</span
					>
					{#if priceOverride}
						<span class="text-1 font-semibold tracking-tight text-gray-900">
							{priceOverride > 0 ? `$${centsToDollars(priceOverride)}` : 'Free'}
						</span>
					{/if}
					<span class="text-4 font-semibold tracking-wide text-gray-600">/month</span>
				</p>
				{#if orgName && startManagedSubscription}
					<button
						disabled={isLoading}
						class="btn btn--primary mt-10 block w-full"
						onclick={() => {
							startManagedSubscription();
							trackingStore.trackAction('Sign up with org');
						}}
					>
						Sign Up with {orgName}
					</button>
					<button
						disabled={isLoading}
						class="btn btn-outline--primary mt-1 block w-full"
						onclick={() => {
							startFreeTrial();
							trackingStore.trackAction('Start Free Personal Trial Click');
						}}
					>
						Start my free trial
					</button>
				{:else}
					<button
						disabled={isLoading}
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
