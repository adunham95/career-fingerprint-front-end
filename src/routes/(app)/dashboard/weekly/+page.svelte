<script>
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import NewAchievementForm from '$lib/Components/Forms/AchievementForm.svelte';
	import { onMount } from 'svelte';
	import { trackingStore } from '$lib/Stores/tracking.js';
	import GoalList from '../goalList.svelte';

	onMount(() => {
		trackingStore.pageViewEvent('Weekly Check-in Dashboard');
	});
</script>

<div class="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
	<div class="mx-auto max-w-2xl text-center lg:max-w-4xl">
		<h2 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
			What did you accomplish this week?
		</h2>
	</div>
</div>

<PageContainer>
	<div class="grid grid-cols-1 gap-4 py-2 md:grid-cols-2">
		<Card headline="Add New Achievement">
			<NewAchievementForm id="check-in" />
			<div class="flex justify-end pt-2">
				<button
					form="check-in"
					type="submit"
					class="btn btn--primary"
					onclick={() => trackingStore.trackAction('Add Achievement Click')}>Add Achievement</button
				>
			</div>
		</Card>
		<div>
			<GoalList />
		</div>
	</div>
</PageContainer>
