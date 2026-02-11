<script lang="ts">
	interface Props {
		status: string;
	}

	const { status }: Props = $props();

	let statusDetails = $derived(() => {
		switch (status) {
			case 'active':
				return { text: 'Active', color: 'badge--success' };
			case 'inactive':
				return { text: 'Inactive', color: 'badge--warning' };

			default:
				return { text: '', color: 'badge--secondary' };
		}
	});
</script>

<span class={`badge ${statusDetails().color}`}>{statusDetails().text}</span>
