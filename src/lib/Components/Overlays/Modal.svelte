<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		isOpen?: boolean;
		children: Snippet;
		actions?: Snippet;
		title: string;
		onClose?: () => void;
		size?: 'sm' | 'md' | 'lg';
	}

	let {
		isOpen = $bindable(false),
		children,
		title,
		actions,
		onClose,
		size = 'sm'
	}: Props = $props();

	let element: HTMLDialogElement;
	$effect(() => {
		if (!element) return;

		if (isOpen) {
			element.showModal();
			isOpen = true;
		} else {
			isOpen = false;
			element.close();
			onClose?.();
		}
	});

	let sizeClass = $derived(() => {
		switch (size) {
			case 'lg':
				return 'max-w-md  md:min-w-2xl';

			default:
				return 'max-w-md  md:min-w-lg';
		}
	});
</script>

<dialog
	bind:this={element}
	class={`bg-surface-50 mx-auto my-5 w-full rounded backdrop:bg-gray-700/30  ${sizeClass()} `}
>
	<div
		class="relative transform overflow-hidden rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:w-full sm:p-6"
	>
		<div class="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
			<button
				onclick={() => (isOpen = false)}
				type="button"
				class="focus:ring-primary rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-offset-2 focus:outline-hidden"
			>
				<span class="sr-only">Close</span>
				<svg
					class="size-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					aria-hidden="true"
					data-slot="icon"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
				</svg>
			</button>
		</div>
		<div class="mt-3 text-center sm:mt-0 sm:text-left">
			<h3 class="font-title text-lg text-gray-900" id="dialog-title">{title}</h3>
			<div class="mt-2">
				{@render children()}
			</div>
		</div>
		{#if actions}
			<div class="mt-5 flex justify-end gap-x-2 sm:mt-6">
				{@render actions?.()}
			</div>
		{/if}
	</div>
</dialog>
