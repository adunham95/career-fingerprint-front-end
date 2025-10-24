<script lang="ts">
	import InfoBlock from '$lib/Components/InfoBlock.svelte';
	import MeetingTable from '$lib/Components/MeetingTable.svelte';
	import { trackingStore } from '$lib/Stores/tracking.js';
	import { onMount } from 'svelte';

	const { data } = $props();

	console.log(data);

	onMount(() => {
		trackingStore.pageViewEvent('Job Application', { tab: 'Meetings' });
	});
</script>

{#if (data.meetings?.length || 0) > 0}
	<MeetingTable meetings={data.meetings || []} hrefBase="/meetings" />
{:else}
	<!-- TODO Create Copy -->
	<InfoBlock title="Empty Meetings" description="Your meetings list is empty. " />
{/if}
