<script lang="ts">
	import { usePreviousMeetings, useUpcomingMeetings } from '$lib/API/meeting';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import NewMeetingForm from '$lib/Components/Forms/MeetingForm.svelte';
	import MeetingTable from '$lib/Components/MeetingTable.svelte';
	import Drawer from '$lib/Components/Overlays/Drawer.svelte';
	import { trackingStore } from '$lib/Stores/tracking.js';
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	const { data } = $props();

	let isNewMeetingOpen = $state(false);
	let pageNumber = 1;
	let meetingType = $state<string>('all');

	let upcomingMeetings = useUpcomingMeetings();
	let previousMeeting = usePreviousMeetings();

	let meetings = $derived.by(() => {
		switch (meetingType) {
			case 'upcoming':
				return $upcomingMeetings.data;
			case 'previous':
				return $previousMeeting.data;
			default:
				return data.meetings;
		}
	});

	console.log({ data });

	onMount(() => {
		let meetingTab = page.url.searchParams.get('tab');
		if (meetingTab) {
			meetingType = meetingTab;
		}
		trackingStore.pageViewEvent('My Meetings');
	});
</script>

<PageContainer className="py-4">
	<div class="px-4 sm:px-6 lg:px-8">
		<div>
			<div class="flex flex-wrap items-center gap-6 sm:flex-nowrap">
				<h1 class="text-lg font-semibold text-gray-900">My Meetings</h1>
				<div
					class="order-last flex w-full gap-x-8 text-sm/6 font-semibold sm:order-0 sm:w-auto sm:border-l sm:border-gray-200 sm:pl-6 sm:text-sm/7"
				>
					<button
						onclick={() => {
							meetingType = 'previous';
							trackingStore.trackAction('Meeting Type Click', {
								tab: 'Previous'
							});
						}}
						class={`${meetingType === 'previous' ? 'text-primary' : ''}`}>Previous</button
					>
					<button
						onclick={() => {
							meetingType = 'all';
							trackingStore.trackAction('Meeting Type Click', {
								tab: 'All'
							});
						}}
						class={`${meetingType === 'all' ? 'text-primary' : ''}`}>All</button
					>
					<button
						onclick={() => {
							meetingType = 'upcoming';
							trackingStore.trackAction('Meeting Type Click', {
								tab: 'Upcoming'
							});
						}}
						class={`${meetingType === 'upcoming' ? 'text-primary' : ''}`}>Upcoming</button
					>
				</div>
				<button
					type="button"
					onclick={() => {
						isNewMeetingOpen = true;
						trackingStore.trackAction('Create New Meeting Click');
					}}
					class="btn btn--primary ml-auto"
				>
					Create New Meeting
				</button>
			</div>
		</div>
		<div class="-mx-4 mt-8 sm:-mx-0">
			<MeetingTable {meetings} />
		</div>
		<!-- <nav
			aria-label="Pagination"
			class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
		>
			<div class="hidden sm:block">
				<p class="text-sm text-gray-700">
					Showing
					<span class="font-medium">1</span>
					to
					<span class="font-medium">10</span>
					of
					<span class="font-medium">20</span>
					results
				</p>
			</div>
			<div class="flex flex-1 justify-between sm:justify-end">
				<button
					class="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus-visible:outline-offset-0"
				>
					Previous
				</button>
				<button
					class="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus-visible:outline-offset-0"
				>
					Next
				</button>
			</div>
		</nav> -->
	</div>
</PageContainer>

<Drawer
	bind:isOpen={isNewMeetingOpen}
	title="Add New Meeting"
	subTitle="Create a new interview, or internal meeting"
	saveFormID="newMeeting"
>
	<NewMeetingForm id="newMeeting" />
</Drawer>
