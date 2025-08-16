<script lang="ts">
	import MeetingTable from '$lib/Components/MeetingTable.svelte';
	import { trackingStore } from '$lib/Stores/tracking.js';
	import { onMount } from 'svelte';

	const { data } = $props();

	console.log(data);

	onMount(() => {
		trackingStore.pageViewEvent('Job Application', { tab: 'Meetings' });
	});
</script>

<MeetingTable meetings={data.meetings || []} />
