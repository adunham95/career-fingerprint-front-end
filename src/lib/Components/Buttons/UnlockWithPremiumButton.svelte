<script lang="ts">
	interface Props {
		featureName: string;
		size?: 'sm' | 'md' | 'lg';
	}

	const { featureName, size = 'md' }: Props = $props();

	const sizeStyle = $derived.by(() => {
		switch (size) {
			case 'sm':
				return { text: 'text-sm', icon: 'size-4' };
			case 'lg':
				return { text: 'text-lg', icon: 'size-8' };

			default:
				return { text: 'text-base', icon: 'size-6' };
		}
	});
</script>

<div
	class="ml-1 flex items-center justify-center rounded-lg border-2 border-amber-300 bg-amber-100 p-1"
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class={sizeStyle.icon}
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
		/>
	</svg>
	<p class={`mx-1 ${sizeStyle.text}`}>Unlock {featureName} with Premium</p>
</div>
