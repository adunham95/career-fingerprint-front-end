<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		headline?: string;
		actions?: Snippet;
		className?: string;
		headlineClassName?: string;
		contentClassName?: string;
		actionsClassName?: string;
	}

	const {
		children,
		headline,
		actions,
		className = '',
		headlineClassName = '',
		actionsClassName = '',
		contentClassName = ''
	}: Props = $props();
</script>

<div class={`bg-surface-50 shadow-xs ring-1 ring-gray-900/5 sm:rounded-xl ${className}`}>
	{#if headline}
		<h4 class={`font-title px-8 pt-8 text-xl font-semibold text-gray-900 ${headlineClassName}`}>
			{headline}
		</h4>
	{/if}
	<div class={`p-8 ${headline && 'pt-4'} ${actions && 'pb-4'} ${contentClassName}`}>
		{@render children()}
	</div>
	{#if actions}
		<div
			class={`flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8 ${actionsClassName}`}
		>
			{@render actions()}
		</div>
	{/if}
</div>
