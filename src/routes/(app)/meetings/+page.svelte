<script lang="ts">
	import { usePreviousMeetings, useUpcomingMeetings } from '$lib/API/meeting';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import NewMeetingForm from '$lib/Components/Forms/MeetingForm.svelte';
	import Drawer from '$lib/Components/Overlays/Drawer.svelte';
	import { trackingStore } from '$lib/Stores/tracking.js';
	import { format } from 'date-fns';
	import { onMount } from 'svelte';

	const { data } = $props();

	let isNewMeetingOpen = $state(false);
	let page = 1;
	let meetingType = $state<'all' | 'upcoming' | 'previous'>('previous');

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
			<table class="min-w-full divide-y divide-gray-300">
				<thead>
					<tr>
						<th
							scope="col"
							class="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-0"
						>
							Name
						</th>
						<th
							scope="col"
							class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
							>Date</th
						>
						<th
							scope="col"
							class=" hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
							>Type</th
						>
						<th scope="col" class="relative py-3.5 pr-4 pl-3 sm:pr-0">
							<span class="sr-only">Select</span>
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 bg-white">
					{#each meetings as meeting}
						{@const date = new Date(meeting.time)}
						<tr>
							<td
								class="w-full max-w-0 py-4 pr-3 pl-4 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0"
							>
								{meeting.title}
								<dl class="font-normal lg:hidden">
									<dt class="sr-only">Date</dt>
									<dd class="mt-1 truncate text-gray-700">
										{format(date, 'PPP p')}
									</dd>
									<dt class="sr-only sm:hidden">Type</dt>
									<dd class="mt-1 truncate text-gray-500 sm:hidden">{meeting.type}</dd>
								</dl>
							</td>

							<td class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
								{format(date, 'PPP p')}
							</td>
							<td class="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">{meeting.type}</td>
							<td class="py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-0">
								<a
									href={`/meetings/${meeting.id}`}
									onclick={() => {
										trackingStore.trackAction('View Meeting Click');
									}}
									class="btn btn-text--primary"
								>
									View
								</a>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
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
