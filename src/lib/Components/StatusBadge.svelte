<script lang="ts">
	import { AppStatusEnum } from '$lib/Utils/AppStatusTypes';

	interface Props {
		status: AppStatusEnum;
	}

	const { status }: Props = $props();

	const statusDetails = {
		[AppStatusEnum.APPLIED]: { text: 'Applied', color: 'badge--secondary' },
		[AppStatusEnum.INTERVIEWING]: { text: 'Interviewing', color: 'badge--primary' },
		[AppStatusEnum.NEGOTIATION]: { text: 'Negotiation', color: 'badge--secondary' },
		[AppStatusEnum.ARCHIVE]: { text: 'Archived', color: 'badge--info' },
		[AppStatusEnum.GHOST]: { text: 'Ghosted', color: 'badge--warning' },
		[AppStatusEnum.REJECTED]: { text: 'Rejected', color: 'badge--error' },
		[AppStatusEnum.ACCEPTED]: { text: 'Accepted', color: 'badge--success' }
	};
</script>

{#if statusDetails.hasOwnProperty(status)}
	{@const details = statusDetails[status as keyof typeof statusDetails]}
	<span class={`badge ${details.color}`}>{details.text}</span>
{:else}
	<span class="badge badge--secondary">{status}</span>
{/if}
