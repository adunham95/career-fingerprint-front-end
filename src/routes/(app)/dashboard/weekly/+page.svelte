<script>
	import UpcomingEventRow from '$lib/Components/Calender/UpcomingEventRow.svelte';
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import NewAchievementForm from '$lib/Components/Forms/AchievementForm.svelte';
	import Drawer from '$lib/Components/Overlays/Drawer.svelte';
	import NewMeetingForm from '$lib/Components/Forms/MeetingForm.svelte';
	import { useUpcomingMeetings } from '$lib/API/meeting.js';
	import { onMount } from 'svelte';
	import { trackingStore } from '$lib/Stores/tracking.js';

	const { data } = $props();

	let isNewMeetingOpen = $state(false);

	let meetings = useUpcomingMeetings(data.meetings || []);

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
	<div class="grid grid-cols-2 gap-4 py-2">
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
			<div class="flex justify-between">
				<h3 class="font-title pb-4 text-xl">Upcoming Meetings</h3>
				<button
					class="btn btn-text--primary"
					onclick={() => {
						isNewMeetingOpen = true;
						trackingStore.trackAction('Add Meeting Click');
					}}>Add Meeting</button
				>
			</div>
			<ul class="space-y-2">
				{#each $meetings.data || [] as meeting}
					<li>
						<Card size="sm">
							<UpcomingEventRow {...meeting} />
						</Card>
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
