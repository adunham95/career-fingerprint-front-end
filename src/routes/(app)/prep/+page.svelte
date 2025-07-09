<script>
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import NewMeetingForm from '$lib/Components/Forms/NewMeetingForm.svelte';
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
</PageContainer>

<Drawer
	bind:isOpen={isNewMeetingOpen}
	title="Add New Meeting"
	subTitle="Create a new interview, or internal meeting"
	saveFormID="newMeeting"
>
	<NewMeetingForm id="newMeeting" />
</Drawer>
