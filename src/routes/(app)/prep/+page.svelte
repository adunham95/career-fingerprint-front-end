<script>
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import NewMeetingForm from '$lib/Components/Forms/MeetingForm.svelte';
	import Drawer from '$lib/Components/Overlays/Drawer.svelte';
	import { getMonthName } from '$lib/Utils/formatDate.js';
	import { format } from 'date-fns';

	const { data } = $props();

	let isNewMeetingOpen = $state(false);
	console.log({ data });
</script>

<PageContainer className="py-4">
	<div class="px-4 sm:px-6 lg:px-8">
		<div class="sm:flex sm:items-center">
			<div class="sm:flex-auto">
				<h1 class="font-title text-2xl font-semibold text-gray-900">Select a meeting</h1>
				<p class="mt-2 text-sm text-gray-700">Select a meeting to make a cheatsheet.</p>
			</div>
			<div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
				<button type="button" onclick={() => (isNewMeetingOpen = true)} class="btn btn--primary">
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
					{#each data.meetings as meeting}
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
								<a href={`/prep/${meeting.id}`} class="text-primary hover:text-primary-900">
									Start
								</a>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div></PageContainer
>

<Drawer
	bind:isOpen={isNewMeetingOpen}
	title="Add New Meeting"
	subTitle="Create a new interview, or internal meeting"
	saveFormID="newMeeting"
>
	<NewMeetingForm id="newMeeting" />
</Drawer>
