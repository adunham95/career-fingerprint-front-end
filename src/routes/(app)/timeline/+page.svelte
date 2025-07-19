<script>
	import ExpandedTimeline from '$lib/Components/Calender/ExpandedTimeline.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import TwoColumn from '$lib/Components/Containers/TwoColumn.svelte';
	const { data } = $props();
</script>

<PageContainer>
	<div class="mt-5 mb-5 border-b border-gray-200 pb-5">
		<h1 class="text-2xl font-semibold text-gray-900">My Achievement Timeline</h1>
	</div>
	<div class="grid grid-cols-2">
		<ExpandedTimeline
			dates={data.achievements?.map((ach) => {
				return {
					title: 'Achievement',
					date: ach.startDate ? new Date(ach.startDate) : new Date(),
					description: ach.myContribution,
					type: 'achievement'
				};
			}) || []}
		/>
	</div>
</PageContainer>
