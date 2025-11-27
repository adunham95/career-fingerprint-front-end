<script lang="ts">
	import { usePreviewAchievements } from '$lib/API/achievements';
	import Timeline from '$lib/Components/Calender/Timeline.svelte';
	import InfoBlock from '$lib/Components/InfoBlock.svelte';
	import Loader from '$lib/Components/Loader.svelte';

	const previewAchievements = usePreviewAchievements();
</script>

<div class="bg-surface-100 rounded border-3 border-gray-200 p-4 md:col-span-2">
	<h1 class="font-title pb-4 text-2xl">My Achievement Timeline</h1>
	{#if ($previewAchievements.data || []).length > 0}
		<Timeline
			dates={$previewAchievements.data?.map((ach) => {
				return {
					title: 'Achievement',
					date: ach.startDate ? new Date(ach.startDate) : new Date(),
					description: ach.myContribution,
					type: 'achievement'
				};
			}) || []}
		/>
	{:else if $previewAchievements.isLoading}
		<div class="flex justify-center">
			<Loader />
		</div>
	{:else}
		<InfoBlock
			title="Achievements"
			description="Your achievement timeline is empty. To add a new achievement click Add Achievement"
		/>
	{/if}
</div>
