<script lang="ts">
	interface Props {
		size?: 'sm' | 'md' | 'lg';
	}

	const { size = 'lg' }: Props = $props();

	let sizeClass = $derived.by(() => {
		switch (size) {
			case 'sm':
				return 'h-5 w-5 border-2';
			case 'md':
				return 'h-10 w-10 border-4';

			default:
				return 'h-20 w-20 border-8';
		}
	});
</script>

<div class={`border-t-primary-600 ${sizeClass} animate-spin rounded-full  border-gray-300`}></div>
