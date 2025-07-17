<script>
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import NewMeetingForm from '$lib/Components/Forms/MeetingForm.svelte';
	import Drawer from '$lib/Components/Overlays/Drawer.svelte';

	const { data } = $props();

	let isNewMeetingOpen = $state(false);
	console.log({ data });
</script>

<PageContainer className="py-4">
	<h1 class="font-title py-2 text-2xl">Select a meeting</h1>
	<ul role="list" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
		<li class="aspect-square">
			<button
				type="button"
				class="relative block h-full w-full cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden"
				onclick={() => (isNewMeetingOpen = true)}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="mx-auto size-12 text-gray-400"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
					/>
				</svg>

				<span class="mt-2 block text-sm font-semibold text-gray-900">Create a new meeting</span>
			</button>
		</li>
		{#each data.meetings as meeting}
			<li class="aspect-square">
				<a href={`/prep/${meeting.id}`}>
					<Card className="h-full">
						<p>{meeting.title}</p>
						<!-- <p class="text-xs text-gray-400">
							Last Edited {getMonthName(date.getMonth())}
							{date.getFullYear()}
						</p> -->
					</Card>
				</a>
			</li>
		{/each}
	</ul>

	<div class="px-4 sm:px-6 lg:px-8">
		<div class="sm:flex sm:items-center">
			<div class="sm:flex-auto">
				<h1 class="font-title text-2xl font-semibold text-gray-900">Select a meeting</h1>
				<p class="mt-2 text-sm text-gray-700">
					A list of all the users in your account including their name, title, email and role.
				</p>
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
							>Name</th
						>
						<th
							scope="col"
							class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
							>Title</th
						>
						<th
							scope="col"
							class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
							>Email</th
						>
						<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
							>Role</th
						>
						<th scope="col" class="relative py-3.5 pr-4 pl-3 sm:pr-0">
							<span class="sr-only">Edit</span>
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 bg-white">
					<tr>
						<td
							class="w-full max-w-0 py-4 pr-3 pl-4 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0"
						>
							Lindsay Walton
							<dl class="font-normal lg:hidden">
								<dt class="sr-only">Title</dt>
								<dd class="mt-1 truncate text-gray-700">Front-end Developer</dd>
								<dt class="sr-only sm:hidden">Email</dt>
								<dd class="mt-1 truncate text-gray-500 sm:hidden">lindsay.walton@example.com</dd>
							</dl>
						</td>
						<td class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">Front-end Developer</td
						>
						<td class="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell"
							>lindsay.walton@example.com</td
						>
						<td class="px-3 py-4 text-sm text-gray-500">Member</td>
						<td class="py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-0">
							<a href="#" class="text-indigo-600 hover:text-indigo-900"
								>Edit<span class="sr-only">, Lindsay Walton</span></a
							>
						</td>
					</tr>
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
