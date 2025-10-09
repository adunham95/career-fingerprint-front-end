<script lang="ts">
	import { trackingStore } from '$lib/Stores/tracking';
	import type { Snippet } from 'svelte';

	interface Props {
		icon: Snippet;
		children?: Snippet;
		actionName: string;
		title: string;
		subTitle: string;
		color: 'green' | 'blue' | 'purple' | 'orange' | 'red' | 'pink';
		onClick?: () => void;
		href?: string;
		premiumAction?: boolean;
		premiumLocked?: boolean;
		demoLocked?: boolean;
		disabled?: boolean;
	}

	const {
		icon,
		actionName,
		title,
		subTitle,
		color,
		onClick,
		href,
		premiumAction = false,
		premiumLocked = false,
		demoLocked = false,
		disabled = false,
		children
	}: Props = $props();

	let colorStyle = $derived(() => {
		switch (color) {
			case 'green':
				return 'border-pastel-green-600 hover:border-pastel-green-900 hover:bg-pastel-green-600/40 bg-pastel-green-600/10 focus:ring-pastel-green-500';
			case 'blue':
				return 'border-pastel-blue-600 bg-pastel-blue-600/10 hover:border-pastel-blue-900 hover:bg-pastel-blue-600/50 focus:ring-pastel-blue-500';
			case 'purple':
				return 'border-pastel-purple-600 bg-pastel-purple-600/10 hover:border-pastel-purple-900 hover:bg-pastel-purple-600/50 focus:ring-pastel-purple-500';
			case 'orange':
				return 'border-pastel-orange-600 bg-pastel-orange-600/10 hover:border-pastel-orange-900 hover:bg-pastel-orange-600/50 focus:ring-pastel-orange-500';
			case 'red':
				return 'border-pastel-red-600 bg-pastel-red-600/10 hover:border-pastel-red-900 hover:bg-pastel-red-600/50 focus:ring-pastel-red-50';
			case 'pink':
				return 'border-pastel-pink-600 bg-pastel-pink-600/10 hover:border-pastel-pink-900 hover:bg-pastel-pink-600/50 focus:ring-pastel-pink-50';
			default:
				return '';
		}
	});

	let baseStyles =
		'relative flex aspect-square w-full cursor-pointer items-center justify-center rounded-lg border-3 p-2 text-center transition focus:ring-2 focus:ring-offset-2 focus:outline-hidden md:aspect-video';
</script>

{#if premiumLocked}
	<a
		href="/settings/membership"
		onclick={() => {
			trackingStore.trackAction(actionName, { unlockPremium: 'true' });
		}}
		class={`${baseStyles} border-gray-600/30 bg-gray-600/10 p-2 focus:ring-amber-500`}
	>
		<div
			class=" absolute top-1 right-1 flex justify-center rounded-lg border-2 border-amber-300 bg-amber-100 p-1"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-4"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
				/>
			</svg>
			<p class="mx-1 text-sm">Unlock with Premium</p>
		</div>
		<div class="opacity-30">
			{@render internal()}
		</div>
	</a>
{:else if demoLocked}
	<div class={`${baseStyles} border-gray-600/30 bg-gray-600/10 p-2`}>
		<div class=" absolute top-1 right-1 flex justify-center rounded-lg border-2 bg-gray-400 p-1">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-4"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
				/>
			</svg>
			<p class="mx-1 text-sm">Unavailable for demo</p>
		</div>
		<div class="opacity-30">
			{@render internal()}
		</div>
	</div>
{:else if onClick}
	<button
		{disabled}
		onclick={() => {
			onClick();
			trackingStore.trackAction(actionName);
		}}
		class={`${baseStyles} ${colorStyle()} `}
	>
		{#if premiumAction}
			{@render includedWithPremium()}
		{/if}
		{@render internal()}
		{@render children?.()}
	</button>
{:else if href}
	<a
		{href}
		onclick={() => {
			trackingStore.trackAction(actionName);
		}}
		class={`${baseStyles} ${colorStyle()}`}
	>
		{#if premiumAction}
			{@render includedWithPremium()}
		{/if}
		{@render internal()}
		{@render children?.()}
	</a>
{/if}

{#snippet internal()}
	<div class="flex flex-col items-center">
		{@render icon()}

		<p>{title}</p>
		<p class=" text-xs">{subTitle}</p>
	</div>
{/snippet}

{#snippet includedWithPremium()}
	<div class=" absolute top-1 right-1 flex justify-center rounded p-1 text-black/45">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
			<path
				fill-rule="evenodd"
				d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
				clip-rule="evenodd"
			/>
		</svg>

		<span class="sr-only">Included with Premium</span>
	</div>
{/snippet}
