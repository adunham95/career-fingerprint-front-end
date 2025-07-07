<script>
	import Calender from '$lib/Components/Calender/Calender.svelte';
	import Timeline from '$lib/Components/Calender/Timeline.svelte';
	import UpcomingEventRow from '$lib/Components/Calender/UpcomingEventRow.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import NewAchievementForm from '$lib/Components/Forms/NewAchievementForm.svelte';
	import NewMeetingForm from '$lib/Components/Forms/NewMeetingForm.svelte';
	import Drawer from '$lib/Components/Overlays/Drawer.svelte';
	import Modal from '$lib/Components/Overlays/Modal.svelte';

	let { data } = $props();

	console.log(data);

	let dialogOpen = $state(false);
	let isAchievementOpen = $state(false);
	let isNewMeetingOpen = $state(false);
</script>

<PageContainer className="py-6">
	<p class="font-title text-4xl">Hello, {data.user.firstName}</p>
	<div class="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
		<button
			onclick={() => (isAchievementOpen = true)}
			class="border-pastel-green-600 hover:border-pastel-green-900 hover:bg-pastel-green-600/40 bg-pastel-green-600/10 focus:ring-pastel-gree-500 relative flex aspect-square w-full cursor-pointer items-center justify-center rounded-lg border-2 p-2 text-center transition focus:ring-2 focus:ring-offset-2 focus:outline-hidden md:aspect-video"
		>
			<div class="flex flex-col items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-8"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
					/>
				</svg>

				<p>Add Achievement</p>
				<p class=" text-xs">Take note of your achievements</p>
			</div>
		</button>
		<button
			onclick={() => (dialogOpen = true)}
			class="border-pastel-blue-600 bg-pastel-blue-600/10 hover:border-pastel-blue-900 hover:bg-pastel-blue-600/50 focus:ring-patel-blue-500 relative flex aspect-square w-full cursor-pointer items-center justify-center rounded-lg border-2 p-2 text-center transition focus:ring-2 focus:ring-offset-2 focus:outline-hidden md:aspect-video"
		>
			<div class="flex flex-col items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-8"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
					/>
				</svg>

				<p>Start Meeting</p>
				<p class=" text-xs">Quickly access your cheat sheet for an interview or 1:1</p>
			</div>
		</button>
		<div
			class="border-pastel-purple-600 bg-pastel-purple-600/10 hover:border-pastel-purple-900 hover:bg-pastel-purple-600/50 focus:ring-pastel-purple-500 relative flex aspect-square w-full cursor-pointer items-center justify-center rounded-lg border-2 p-2 text-center transition focus:ring-2 focus:ring-offset-2 focus:outline-hidden md:aspect-video"
		>
			<div class="flex flex-col items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-8"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
					/>
				</svg>

				<p>Prepare</p>
				<p class=" text-xs">Prepare your 1:1, Annual Review or Interview</p>
			</div>
		</div>
		<div
			class="border-pastel-orange-600 bg-pastel-orange-600/10 hover:border-pastel-orange-900 hover:bg-pastel-orange-600/50 focus:ring-pastel-orange-500 relative flex aspect-square w-full cursor-pointer items-center justify-center rounded-lg border-2 p-2 text-center focus:ring-2 focus:ring-offset-2 focus:outline-hidden md:aspect-video"
		>
			<div class="flex flex-col items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-8"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
					/>
				</svg>

				<p>Download Achievements</p>
				<p class=" text-xs">Download a list if you achievements</p>
			</div>
		</div>
	</div>

	<div class="mt-3 grid grid-cols-1 grid-rows-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
		<div class="bg-surface-100 row-span-2 rounded border border-gray-200 p-4 md:col-span-2">
			<h1 class="font-title pb-4 text-2xl">My Achievement Timeline</h1>
			<Timeline
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

		<div class="bg-surface-100 rounded border border-gray-200 p-4 md:col-span-2">
			<div class="flex justify-between">
				<h1 class="font-title pb-4 text-2xl">Upcoming</h1>
				<button
					class="btn btn-outline--secondary flex items-center py-1"
					onclick={() => (isNewMeetingOpen = true)}>Add Meeting</button
				>
			</div>
			<ol class=" divide-y divide-gray-100 text-sm/6 lg:col-span-7 xl:col-span-8">
				<UpcomingEventRow name="James Smith" eventTime={new Date()} />
			</ol>
		</div>
		<div class="bg-surface-100 rounded border border-gray-200 p-6 md:col-span-2">
			<Calender disableSelectedDays />
		</div>
	</div>
</PageContainer>

<Drawer
	bind:isOpen={isAchievementOpen}
	title="Add Achievement"
	subTitle="Add an a achievement here"
	saveFormID="newAchievement"
>
	<NewAchievementForm id="newAchievement" onSuccess={() => (isAchievementOpen = false)} />
</Drawer>

<Drawer
	bind:isOpen={isNewMeetingOpen}
	title="Add New Meeting"
	subTitle="Create a new interview, or internal meeting"
	saveFormID="newMeeting"
>
	<NewMeetingForm id="newMeeting" />
</Drawer>

<Modal bind:isOpen={dialogOpen} title="Select Type">
	{#snippet children()}
		<p>Select what type of meeting you want to start</p>
	{/snippet}
	{#snippet actions()}
		<div class="grid w-full grid-cols-2 gap-2">
			<a
				href="/cheatsheet?interview"
				class="btn btn-outline--secondary btn-small w-full text-center">Interview</a
			>
			<a
				href="/cheatsheet?interview"
				class="btn btn-outline--secondary btn-small w-full text-center">Internal</a
			>
		</div>
	{/snippet}
</Modal>
