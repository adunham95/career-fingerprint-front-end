<script lang="ts">
	import type { Snippet } from 'svelte';
	import TypingText from './TypingText.svelte';

	let showAction = $state(false);

	interface Props {
		title: string;
		children: Snippet;
	}

	const { title, children }: Props = $props();
</script>

<div class="flex justify-start">
	<div class="max-w-[500px] p-1">
		<TypingText textClass="text-xl" text={title} onFinish={() => (showAction = true)} />
	</div>
</div>

{#if showAction}
	<div class="flex justify-end">
		<div class="flex max-w-[500px] flex-col items-end">
			{@render children()}
		</div>
	</div>
{/if}
