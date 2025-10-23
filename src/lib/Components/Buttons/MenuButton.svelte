<script lang="ts">
	interface ButtonOption {
		title: string;
		href?: string;
		onClick?: () => void;
	}

	interface Props {
		size?: string;
		buttons: ButtonOption[];
	}

	let isOpen = $state(false);
	const { buttons, size = 'size-5' }: Props = $props();
</script>

<div class="relative flex-none">
	<button
		type="button"
		onclick={() => (isOpen = !isOpen)}
		aria-expanded="false"
		aria-haspopup="true"
		class="relative block text-gray-500 hover:text-gray-900"
	>
		<span class="absolute -inset-2.5"></span>
		<span class="sr-only">Open options</span>
		<svg
			viewBox="0 0 20 20"
			fill="currentColor"
			data-slot="icon"
			aria-hidden="true"
			class={`${size}`}
		>
			<path
				d="M10 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM10 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM11.5 15.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z"
			/>
		</svg>
	</button>

	{#if isOpen}
		<div
			role="menu"
			tabindex="-1"
			aria-labelledby="options-menu-0-button"
			aria-orientation="vertical"
			class="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-hidden"
		>
			{#each buttons as button, idx}
				{#if button.href}
					<a
						role="menuitem"
						onclick={() => (isOpen = false)}
						href={button.href}
						tabindex="-1"
						class="hover:bg-secondary/50 block px-3 py-1 text-sm/6 text-gray-900"
					>
						{button.title}
					</a>
				{:else if button.onClick}
					<button
						type="button"
						onclick={() => {
							isOpen = false;
							button?.onClick?.();
						}}
						class="hover:bg-secondary/50 block w-full px-3 py-1 text-start text-sm/6 text-gray-900"
					>
						{button.title}
					</button>
				{:else}
					<div
						class=" block w-full cursor-not-allowed px-3 py-1 text-start text-sm/6 text-gray-900"
					>
						{button.title}
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</div>
