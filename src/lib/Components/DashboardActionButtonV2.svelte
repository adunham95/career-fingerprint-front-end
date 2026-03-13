<script lang="ts">
	import { trackingStore } from '$lib/Stores/tracking';
	import type { Snippet } from 'svelte';

	interface Props {
		icon: Snippet;
		children?: Snippet;
		actionName: string;
		title: string;
		subTitle: string;
		color?: 'green' | 'blue' | 'purple' | 'orange' | 'red' | 'pink';
		onClick?: () => void;
		href?: string;
		premiumAction?: boolean;
		premiumLocked?: boolean;
		demoLocked?: boolean;
		disabled?: boolean;
		locked?: boolean;
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
		locked = false,
		children
	}: Props = $props();

	let baseStyles =
		'relative flex w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-gray-200 bg-gray-50 px-2 py-3.5 text-center transition hover:border-gray-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300';

	let lockedStyles = 'opacity-50 cursor-default hover:bg-gray-50 hover:border-gray-200';
</script>

{#if premiumLocked}
	<a
		href="/settings/membership"
		onclick={() => trackingStore.trackAction(actionName, { unlockPremium: 'true' })}
		class={`${baseStyles} opacity-60`}
	>
		{@render lockBadge('amber', 'Unlock Premium')}
		<div class="opacity-40">{@render internal()}</div>
	</a>
{:else if demoLocked}
	<div class={`${baseStyles} opacity-60`}>
		{@render lockBadge('gray', 'Demo unavailable')}
		<div class="opacity-40">{@render internal()}</div>
	</div>
{:else if locked}
	<div class={`${baseStyles} ${lockedStyles}`}>
		{@render internal()}
		{@render children?.()}
	</div>
{:else if onClick}
	<button
		{disabled}
		onclick={() => {
			onClick();
			trackingStore.trackAction(actionName);
		}}
		class={baseStyles}
	>
		{@render internal()}
		{@render children?.()}
	</button>
{:else if href}
	<a {href} onclick={() => trackingStore.trackAction(actionName)} class={baseStyles}>
		{@render internal()}
		{@render children?.()}
	</a>
{/if}

{#snippet internal()}
	<div class="flex flex-col items-center gap-1">
		<div class="opacity-60">{@render icon()}</div>
		<p class="text-sm leading-tight font-medium text-gray-800">{title}</p>
		<p class="text-xs leading-snug text-gray-400">{subTitle}</p>
	</div>
{/snippet}

{#snippet checkBadge()}
	<div
		class="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-[#00bfa6]"
	>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" fill="none" class="size-2.5">
			<path
				d="M2 5l2.5 2.5 3.5-4"
				stroke="white"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	</div>
{/snippet}

{#snippet lockBadge(tone: string, label: string)}
	<div
		class={`absolute top-1.5 right-1.5 flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-xs
		${tone === 'amber' ? 'border-amber-300 bg-amber-100 text-amber-700' : 'border-gray-300 bg-gray-200 text-gray-600'}`}
	>
		{#if tone === 'amber'}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-3"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
				/>
			</svg>
		{/if}
		{label}
	</div>
{/snippet}
