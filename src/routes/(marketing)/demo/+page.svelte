<script>
	import Timeline from '$lib/Components/Calender/Timeline.svelte';
	import UpcomingEventRow from '$lib/Components/Calender/UpcomingEventRow.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import DashboardActionButton from '$lib/Components/DashboardActionButton.svelte';
	import AchievementForm from '$lib/Components/Forms/AchievementForm.svelte';
	import Drawer from '$lib/Components/Overlays/Drawer.svelte';

	const { data } = $props();
	let isAchievementOpen = $state(false);
</script>

<PageContainer className="py-6">
	<p class="font-title text-4xl">Hello, Demo</p>
	<div class={`mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5`}>
		<DashboardActionButton
			title="Add Achievement"
			subTitle="Take note of your achievements"
			icon={startIcon}
			color="green"
			demoLocked
			actionName="Add Achievement Click"
			onClick={() => {
				isAchievementOpen = true;
			}}
		/>

		<DashboardActionButton
			title="Start Meeting"
			subTitle="Quickly access your cheat sheet for an interview or 1:1"
			color="blue"
			icon={chartIcon}
			actionName="Start Meeting Click"
			premiumAction={true}
			href="/demo/meeting"
		/>

		<DashboardActionButton
			icon={prepIcon}
			title="Prepare"
			subTitle="Prepare your 1:1, Annual Review or Interview"
			actionName="Prepare Click"
			color="purple"
			demoLocked
		/>

		<DashboardActionButton
			icon={meetingIcon}
			title="Previous Meetings"
			subTitle="View your previous meetings details and notes"
			demoLocked
			actionName="Previous Meetings Click"
			color="orange"
		/>

		<DashboardActionButton
			title="Book A Demo"
			subTitle="Schedule a demo with our sales team"
			icon={computerIcon}
			href="/"
			actionName="Manage Organization Click"
			color="pink"
		/>
	</div>

	<div class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
		<div class="bg-surface-100 rounded border-3 border-gray-200 p-4 md:col-span-2">
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

		<div class="bg-surface-100 rounded border-3 border-gray-200 p-4 md:col-span-2">
			<div class="flex justify-between">
				<h1 class="font-title pb-4 text-2xl">Upcoming</h1>
			</div>
			<ol class=" divide-y divide-gray-100 text-sm/6 lg:col-span-7 xl:col-span-8">
				{#each data.meetings || [] as meeting}
					<UpcomingEventRow {...meeting} hideActions />
				{/each}
			</ol>
		</div>
	</div>
</PageContainer>

{#snippet startIcon()}
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
{/snippet}

{#snippet chartIcon()}
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
{/snippet}

{#snippet prepIcon()}
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
{/snippet}

{#snippet meetingIcon()}
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
{/snippet}

{#snippet computerIcon()}
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
			d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
		/>
	</svg>
{/snippet}
