<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		color: string;
		icon?: Snippet;
		text: string;
		onCancel?: () => void;
	}

	const { color = 'gray', icon, text, onCancel }: Props = $props();

	let colorString = $derived.by(() => {
		switch (color) {
			case 'red':
				return 'bg-red-100 text-red-700';
			case 'gray':
				return 'bg-gray-100 text-gray-600';
			case 'green':
				return 'bg-green-100 text-green-700';
			case 'blue':
				return 'bg-blue-100 text-blue-700';
			case 'purple':
				return 'bg-purple-100 text-purple-700';
			case 'pink':
				return 'bg-pink-100 text-pink-700';
			case 'brand':
				return 'bg-primary-200 text-primary';

			default:
				return 'bg-gray-100 text-gray-600';
		}
	});
</script>

<span class={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${colorString}`}>
	{#if icon}
		<span class="mr-1">
			{@render icon?.()}
		</span>
	{/if}
	{text}
	{#if onCancel}
		<button type="button" class="group relative -mr-1 ml-1 size-3.5 rounded-xs hover:bg-red-600/20">
			<span class="sr-only">Remove</span>
			<svg viewBox="0 0 14 14" class="size-3.5 stroke-red-700/50 group-hover:stroke-red-700/75">
				<path d="M4 4l6 6m0-6l-6 6" />
			</svg>
			<span class="absolute -inset-1"></span>
		</button>
	{/if}
</span>
