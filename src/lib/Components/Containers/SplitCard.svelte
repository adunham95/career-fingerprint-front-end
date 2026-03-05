<script lang="ts">
	import type { Snippet } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	interface Props {
		children: Snippet;
		/** Main headline for the right (form) panel */
		headline?: string;
		/** Actions bar rendered at the bottom of the right panel */
		actions?: Snippet;
		/** Slot for the left panel content — title, bullets, social proof etc. */
		valueProp?: Snippet;
		// ── class overrides ──────────────────────────────────────────────────
		className?: string;
		leftClassName?: string;
		headlineClassName?: string;
		contentClassName?: string;
		actionsClassName?: string;
		// ── sizing / form ────────────────────────────────────────────────────
		size?: 'sm' | 'md' | 'lg';
		onSubmit?: () => void;
		formID?: string;
	}

	const {
		children,
		headline,
		actions,
		valueProp,
		className = '',
		leftClassName = '',
		headlineClassName = '',
		contentClassName = '',
		actionsClassName = '',
		size = 'md',
		onSubmit,
		formID
	}: Props = $props();

	const sizeMap = {
		sm: {
			title: 'px-4 pt-4 text-base',
			actions: 'px-4 py-4',
			content: (hasHeadline: boolean, hasActions: boolean) =>
				`p-4 ${hasHeadline ? 'pt-2' : ''} ${hasActions ? 'pb-2' : ''}`
		},
		md: {
			title: 'px-6 pt-6 text-xl',
			actions: 'px-6 py-6',
			content: (hasHeadline: boolean, hasActions: boolean) =>
				`p-6 ${hasHeadline ? 'pt-3' : ''} ${hasActions ? 'pb-3' : ''}`
		},
		lg: {
			title: 'px-8 pt-8 text-xl',
			actions: 'px-8 py-8',
			content: (hasHeadline: boolean, hasActions: boolean) =>
				`p-8 ${hasHeadline ? 'pt-4' : ''} ${hasActions ? 'pb-4' : ''}`
		}
	} as const;

	const sp = $derived(sizeMap[size]);
</script>

{#snippet cardBody()}
	<div class="grid min-h-0 sm:grid-cols-2">
		{#if valueProp}
			<!-- ── LEFT: value prop panel ──────────────────────────────────────── -->
			<div
				class={twMerge(
					'bg-secondary relative overflow-hidden text-white sm:rounded-l-xl',
					'flex flex-col justify-between gap-8 p-8',
					leftClassName
				)}
			>
				{#if valueProp}
					{@render valueProp()}
				{/if}
			</div>
		{/if}

		<!-- ── RIGHT: headline + content + actions ─────────────────────────── -->
		<div class="flex flex-col">
			{#if headline}
				<h4 class={twMerge('font-title font-semibold text-gray-900', sp.title, headlineClassName)}>
					{headline}
				</h4>
			{/if}

			<div class={twMerge(sp.content(!!headline, !!actions), 'flex-1', contentClassName)}>
				{@render children()}
			</div>

			{#if actions}
				<div
					class={twMerge(
						'flex items-center justify-end gap-x-6 border-t-3 border-gray-900/10',
						sp.actions,
						actionsClassName
					)}
				>
					{@render actions()}
				</div>
			{/if}
		</div>
	</div>
{/snippet}

{#if formID}
	<form
		class={twMerge(
			'bg-surface-50 overflow-hidden shadow-xs ring-3 ring-gray-900/5 sm:rounded-xl',
			className
		)}
		id={formID}
		onsubmit={(e) => {
			e.preventDefault();
			onSubmit?.();
		}}
	>
		{@render cardBody()}
	</form>
{:else}
	<div
		class={twMerge(
			'bg-surface-50 overflow-hidden shadow-xs ring-3 ring-gray-900/5 sm:rounded-xl',
			className
		)}
	>
		{@render cardBody()}
	</div>
{/if}
