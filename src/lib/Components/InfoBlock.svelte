<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description: string;
		className?: string;
		actions?: Snippet;
		icon?: 'alert' | 'lightbulb';
	}

	const { title, description, className = '', actions, icon = 'alert' }: Props = $props();
</script>

<div class={`bg-info-100 border-info-200 rounded-md border-3 p-4 ${className}`}>
	<div class="flex">
		<div class="shrink-0">
			{#if icon === 'alert'}
				<svg
					class="text-info-400 size-5"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
					data-slot="icon"
				>
					<path
						fill-rule="evenodd"
						d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
						clip-rule="evenodd"
					/>
				</svg>
			{:else if icon === 'lightbulb'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="text-info-400 size-5"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
					/>
				</svg>
			{/if}
		</div>
		<div class="ml-3">
			<h3 class="text-info-800 text-sm font-bold">{title}</h3>
			<div class="text-info-700 mt-2 text-sm">
				<p>
					{description}
				</p>
			</div>
			{#if actions}
				<div>
					{@render actions()}
				</div>
			{/if}
		</div>
	</div>
</div>
