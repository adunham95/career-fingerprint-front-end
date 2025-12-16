<script lang="ts">
	interface Props {
		type: 'org' | 'coach';
	}

	const { type }: Props = $props();

	$inspect(type);

	let stylesClass = $derived(() => {
		switch (type) {
			case 'coach':
				return 'inline-flex items-center rounded-md bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700 inset-ring inset-ring-blue-700/10';

			default:
				return 'inline-flex items-center rounded-md bg-gray-50 px-1.5 py-0.5 text-xs font-medium text-gray-600 inset-ring inset-ring-gray-500/10';
		}
	});

	let title = $derived(() => {
		switch (type) {
			case 'coach':
				return 'Coach';

			default:
				return 'Organization';
		}
	});
</script>

<span class={stylesClass()}>{title()}</span>
