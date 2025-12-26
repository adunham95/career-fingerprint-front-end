<script>
	import MeetingTable from '$lib/Components/MeetingTable.svelte';

	const { data } = $props();
	console.log(data);
</script>

<MeetingTable meetings={data?.meetings || []} disableViewClick />
