<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		color: 'red' | 'gray';
		icon?: Snippet;
		text: string;
	}

	const { color = 'red', icon, text }: Props = $props();

	let colorString = $derived.by(() => {
		switch (color) {
			case 'red':
				return 'bg-red-100 text-red-700';
			case 'gray':
				return 'bg-gray-100 text-gray-600';

			default:
				break;
		}
	});
</script>

<span class={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${colorString}`}>
	<span class="mr-1">
		{@render icon?.()}
	</span>
	{text}
</span>
