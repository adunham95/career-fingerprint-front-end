<script lang="ts">
	import InfoBlock from '$lib/Components/InfoBlock.svelte';
	import type { Meeting } from '../../../../app';
	import LinkMeetingCard from './LinkMeetingCard.svelte';

	interface Props {
		meetingID: string;
		interviewData: Meeting | null | undefined;
	}

	const { interviewData, meetingID }: Props = $props();
</script>

{#if !interviewData?.jobApp}
	<LinkMeetingCard meetingID={meetingID || ''} />
{:else if !interviewData?.jobApp.jobDescription}
	<InfoBlock title="Missing Job Description" description="There is no job description associated" />
{/if}

<p class="whitespace-pre-wrap">
	{interviewData?.jobApp?.jobDescription}
</p>
