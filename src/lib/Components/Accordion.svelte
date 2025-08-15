<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		actions?: Snippet;
		children: Snippet;
		childrenWrapperClassName?: string;
		className?: string;
	}

	const {
		children,
		title,
		actions,
		childrenWrapperClassName = '',
		className = ''
	}: Props = $props();
</script>

<details class={`group/accordion w-full ${className}`}>
	<summary
		class="btn btn-text--primary flex w-full cursor-pointer list-none items-center justify-between gap-4"
	>
		<div class="flex items-center justify-start">
			<svg
				class="rotate-0 transform transition-all duration-300 group-open/accordion:rotate-180"
				fill="none"
				height="20"
				width="20"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				viewBox="0 0 24 24"
			>
				<polyline points="6 9 12 15 18 9"></polyline>
			</svg>
			<div class="ml-1">{title}</div>
		</div>

		{@render actions?.()}
	</summary>
	<div class={`p-2 ${childrenWrapperClassName}`}>
		{@render children()}
	</div>
</details>
