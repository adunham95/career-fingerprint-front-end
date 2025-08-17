<script>
	import Timeline from '$lib/Components/Calender/Timeline.svelte';
	import UpcomingEventRow from '$lib/Components/Calender/UpcomingEventRow.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import NewAchievementForm from '$lib/Components/Forms/NewAchievementForm.svelte';
	import NewMeetingForm from '$lib/Components/Forms/MeetingForm.svelte';
	import Drawer from '$lib/Components/Overlays/Drawer.svelte';
	import { useCreateMeetingMutation } from '$lib/API/meeting.js';
	import { toastStore } from '$lib/Components/Toasts/toast.js';
	import { goto } from '$app/navigation';
	import Loader from '$lib/Components/Loader.svelte';
	import { useFeatureGate } from '$lib/Utils/featureGate.js';
	import { onMount } from 'svelte';
	import { trackingStore } from '$lib/Stores/tracking.js';
	import InfoBlock from '$lib/Components/InfoBlock.svelte';

	let { data } = $props();

	console.log(data);

	let isAchievementOpen = $state(false);
	let isNewMeetingOpen = $state(false);
	let isLoadingNewMeeting = $state(false);

	onMount(() => {
		trackingStore.pageViewEvent('Dashboard');
	});

	const createNewMeetingMutation = useCreateMeetingMutation();

	async function createNewMeeting() {
		isLoadingNewMeeting = true;
		try {
			const newMeeting = await $createNewMeetingMutation.mutateAsync({
				time: new Date().toISOString()
			});
			setTimeout(() => {
				goto(`cheatsheet/${newMeeting?.id}`);
			}, 1000);
		} catch (error) {
			isLoadingNewMeeting = false;
			toastStore.show({ message: 'There was an error starting your meeting', type: 'error' });
		}
	}
</script>

<PageContainer className="py-6">
	<p class="font-title text-4xl">Hello, {data.user.firstName}</p>
	<div class="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
		<button
			onclick={() => {
				isAchievementOpen = true;
				trackingStore.trackAction('Add Achievement Click');
			}}
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

		{#if useFeatureGate(1, data.user)}
			<button
				onclick={() => {
					createNewMeeting();
					trackingStore.trackAction('Start Meeting Click');
				}}
				disabled={isLoadingNewMeeting}
				class="border-pastel-blue-600 bg-pastel-blue-600/10 hover:border-pastel-blue-900 hover:bg-pastel-blue-600/50 focus:ring-patel-blue-500 group relative flex aspect-square w-full cursor-pointer items-center justify-center rounded-lg border-2 p-2 text-center transition focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:opacity-30 md:aspect-video"
			>
				<div class=" absolute top-1 right-1 flex justify-center rounded p-1 text-black/45">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="size-6"
					>
						<path
							fill-rule="evenodd"
							d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
							clip-rule="evenodd"
						/>
					</svg>

					<span class="sr-only">Included with Premium</span>
				</div>
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
				{#if isLoadingNewMeeting}
					<div class="absolute inset-0 flex items-center justify-center">
						<Loader />
					</div>
				{/if}
			</button>
		{:else}
			<a
				href="/settings/membership"
				onclick={() => {
					trackingStore.trackAction('Add Achievement Click', { unlockPremium: 'true' });
				}}
				class="relative flex aspect-square w-full items-center justify-center rounded-lg border-2 border-gray-600/30 bg-gray-600/10 p-2 text-center transition focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:outline-hidden md:aspect-video"
			>
				<div
					class=" absolute top-1 right-1 flex justify-center rounded border border-amber-300 bg-amber-100 p-1"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
						/>
					</svg>
					<p class="mx-1 text-sm">Unlock with Premium</p>
				</div>
				<div class="flex flex-col items-center opacity-30">
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
			</a>
		{/if}

		{#if useFeatureGate(1, data.user)}
			<a
				href="/prep"
				onclick={() => {
					trackingStore.trackAction('Prepare Click');
				}}
				class="border-pastel-purple-600 bg-pastel-purple-600/10 hover:border-pastel-purple-900 hover:bg-pastel-purple-600/50 focus:ring-pastel-purple-500 relative flex aspect-square w-full cursor-pointer items-center justify-center rounded-lg border-2 p-2 text-center transition focus:ring-2 focus:ring-offset-2 focus:outline-hidden md:aspect-video"
			>
				<div class=" absolute top-1 right-1 flex justify-center rounded p-1 text-black/45">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="size-6"
					>
						<path
							fill-rule="evenodd"
							d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
							clip-rule="evenodd"
						/>
					</svg>

					<span class="sr-only">Included with Premium</span>
				</div>
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
			</a>
		{:else}
			<a
				href="/settings/membership"
				onclick={() => {
					trackingStore.trackAction('Prepare Click', { unlockPremium: 'true' });
				}}
				class="relative flex aspect-square w-full items-center justify-center rounded-lg border-2 border-gray-600/30 bg-gray-600/10 p-2 text-center transition focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:outline-hidden md:aspect-video"
			>
				<div
					class=" absolute top-1 right-1 flex justify-center rounded border border-amber-300 bg-amber-100 p-1"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
						/>
					</svg>
					<p class="mx-1 text-sm">Unlock with Premium</p>
				</div>
				<div class="flex flex-col items-center opacity-30">
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
			</a>
		{/if}

		<a
			href="/meetings"
			onclick={() => {
				trackingStore.trackAction('Previous Meetings Click');
			}}
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
						d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
					/>
				</svg>

				<p>Previous Meetings</p>
				<p class=" text-xs">View your previous meetings details and notes</p>
			</div>
		</a>
	</div>

	<div class="mt-3 grid grid-cols-1 grid-rows-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
		<div class="bg-surface-100 row-span-2 rounded border border-gray-200 p-4 md:col-span-2">
			<h1 class="font-title pb-4 text-2xl">My Achievement Timeline</h1>
			{#if (data.achievements || []).length > 0}
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
			{:else}
				<InfoBlock
					title="Achievements"
					description="Your achievement timeline is empty. To add a new achievement click Add Achievement"
				/>
			{/if}
		</div>

		<div class="bg-surface-100 rounded border border-gray-200 p-4 md:col-span-2">
			<div class="flex justify-between">
				<h1 class="font-title pb-4 text-2xl">Upcoming</h1>
				<button
					class="btn btn-outline--secondary flex items-center py-1"
					onclick={() => {
						isNewMeetingOpen = true;
						trackingStore.trackAction('Add Meeting Click');
					}}>Add Meeting</button
				>
			</div>
			<ol class=" divide-y divide-gray-100 text-sm/6 lg:col-span-7 xl:col-span-8">
				{#if (data.meetings || []).length > 0}
					{#each data.meetings || [] as meeting}
						<UpcomingEventRow {...meeting} hideActions={!useFeatureGate(1, data.user)} />
					{/each}
				{:else}
					<InfoBlock
						title="Upcoming Meetings"
						description="To add a new achievement click Add Meeting"
					/>
				{/if}
			</ol>
		</div>
		<div class="bg-surface-100 rounded border border-gray-200 p-6 md:col-span-2">
			<!-- <Calender disableSelectedDays /> -->
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
