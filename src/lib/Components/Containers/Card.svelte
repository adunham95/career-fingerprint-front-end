<script lang="ts">
	import type { Snippet } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	interface Props {
		children: Snippet;
		headline?: string;
		actions?: Snippet;
		className?: string;
		headlineClassName?: string;
		contentClassName?: string;
		actionsClassName?: string;
		size?: 'sm' | 'md' | 'lg';
	}

	const {
		children,
		headline,
		actions,
		className = '',
		headlineClassName = '',
		actionsClassName = '',
		contentClassName = '',
		size = 'md'
	}: Props = $props();

	function getStyleProps() {
		switch (size) {
			case 'lg':
				return {
					title: 'px-8 pt-8 text-xl ',
					actions: 'px-8 py-8',
					content: ` p-8 ${headline && 'pt-4'} ${actions && 'pb-4'}`
				};
			case 'sm':
				return {
					title: 'px-4 pt-4 text-base',
					actions: 'px-4 py-4',
					content: ` p-4 ${headline && 'pt-2'} ${actions && 'pb-2'}`
				};

			default:
				return {
					title: 'px-6 pt-6 text-xl ',
					actions: 'px-6 py-6',
					content: ` p-6 ${headline && 'pt-3'} ${actions && 'pb-3'}`
				};
		}
	}
</script>

<div class={twMerge('bg-surface-50 shadow-xs ring-3 ring-gray-900/5 sm:rounded-xl', className)}>
	{#if headline}
		<h4
			class={`font-title  font-semibold text-gray-900 ${getStyleProps().title} ${headlineClassName}`}
		>
			{headline}
		</h4>
	{/if}
	<div class={`${getStyleProps().content} ${contentClassName}`}>
		{@render children()}
	</div>
	{#if actions}
		<div
			class={`flex items-center justify-end gap-x-6 border-t-3 border-gray-900/10 ${getStyleProps().actions} ${actionsClassName}`}
		>
			{@render actions()}
		</div>
	{/if}
</div>
