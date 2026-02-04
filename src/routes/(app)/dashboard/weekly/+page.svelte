<script>
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import NewAchievementForm from '$lib/Components/Forms/AchievementForm.svelte';
	import { onMount } from 'svelte';
	import { trackingStore } from '$lib/Stores/tracking.js';
	import Drawer from '$lib/Components/Overlays/Drawer.svelte';
	import NewMeetingForm from '$lib/Components/Forms/MeetingForm.svelte';
	import { useGetMyGoals } from '$lib/API/goals';
	import GoalCard from '$lib/Components/GoalCard/GoalCard.svelte';
	import GoalQuickUpdateCard from '$lib/Components/GoalCard/GoalQuickUpdateCard.svelte';

	const { data } = $props();

	let isNewMeetingOpen = $state(false);

	const myGoals = useGetMyGoals({ active: true, limit: 3, page: 1 });

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
		<div>
			<Card headline="Add New Achievement">
				<NewAchievementForm id="check-in" />
				<div class="flex justify-end pt-2">
					<button
						form="check-in"
						type="submit"
						class="btn btn--primary"
						onclick={() => trackingStore.trackAction('Add Achievement Click')}
						>Add Achievement</button
					>
				</div>
			</Card>
		</div>
		<div class="space-y-4">
			<div class="flex items-end justify-between">
				<div>
					<h2 class="text-lg font-semibold text-gray-900">Goals quick update</h2>
				</div>

				<div class="flex items-center gap-2">
					<a class="text-sm font-medium text-gray-900 underline" href="/goals">View all</a>
				</div>
			</div>

			<!-- Goal mini-cards -->
			<ul class="flex flex-col gap-4">
				{#each $myGoals.data as goal}
					<li class="">
						<GoalQuickUpdateCard goalItem={goal} />
					</li>
				{/each}
			</ul>
		</div>
	</div>
</PageContainer>
<Drawer
	bind:isOpen={isNewMeetingOpen}
	title="Add New Meeting"
	subTitle="Create a new interview, or internal meeting"
	saveFormID="newMeeting"
>
	<NewMeetingForm id="newMeeting" onSuccess={() => (isNewMeetingOpen = false)} />
</Drawer>
