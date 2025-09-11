<script lang="ts">
	interface Props {
		status: string;
	}

	const { status }: Props = $props();

	const statusDetails = {
		canceling: { text: 'Canceling', color: 'badge--warning' },
		active: { text: 'Active', color: 'badge--success' },
		trialing: { text: 'Active Trial', color: 'badge--success' },
		'canceled-stripe': { text: 'Canceled', color: 'badge--error' },
		'canceled-client': { text: 'Canceled', color: 'badge--error' },
		checkout: { text: 'Waiting Payment', color: 'badge--warning' },
		'org-managed': { text: 'Managed By Org', color: 'badge--success' },
		'org-admin-canceled': { text: 'Canceled By Org', color: 'badge--success' }
	};
</script>

{#if statusDetails.hasOwnProperty(status)}
	{@const details = statusDetails[status as keyof typeof statusDetails]}
	<span class={`badge ${details.color}`}>{details.text}</span>
{:else}
	<span class="badge badge--secondary">{status}</span>
{/if}
