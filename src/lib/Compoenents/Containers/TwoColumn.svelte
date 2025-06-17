<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		subTitle?: string;
		children: Snippet;
		childrenClassName?: string;
	}

	const { title, subTitle, children, childrenClassName = '' }: Props = $props();
</script>

<div class="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-3">
	<div class="px-4 sm:px-0">
		<h2 class="text-base/7 font-semibold text-gray-900">{title}</h2>
		<p class="mt-1 text-sm/6 text-gray-600">
			{subTitle}
		</p>
	</div>

	<div class={`md:col-span-2 ${childrenClassName}`}>
		{@render children()}
	</div>
</div>
