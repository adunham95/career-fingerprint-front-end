<script>
	import ExpandedTimeline from '$lib/Components/Calender/ExpandedTimeline.svelte';

	const { data } = $props();
	console.log({ data });
</script>

<div class="grid grid-cols-1 gap-1 pt-2">
	<ExpandedTimeline dates={data.achievements || []} />
</div>
