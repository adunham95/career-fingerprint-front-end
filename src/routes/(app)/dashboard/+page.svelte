<script lang="ts">
	import UpcomingEventRow from '$lib/Components/Calender/UpcomingEventRow.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import NewAchievementForm from '$lib/Components/Forms/AchievementForm.svelte';
	import NewMeetingForm from '$lib/Components/Forms/MeetingForm.svelte';
	import Drawer from '$lib/Components/Overlays/Drawer.svelte';
	import { useCreateMeetingMutation, useUpcomingMeetings } from '$lib/API/meeting.js';
	import { toastStore } from '$lib/Components/Toasts/toast.js';
	import { goto } from '$app/navigation';
	import Loader from '$lib/Components/Loader.svelte';
	import { useFeatureGate } from '$lib/Utils/featureGate.js';
	import { onMount } from 'svelte';
	import { trackingStore } from '$lib/Stores/tracking.js';
	import InfoBlock from '$lib/Components/InfoBlock.svelte';
	import DashboardActionButton from '$lib/Components/DashboardActionButton.svelte';
	import { useLoginOrgAdminMutation } from '$lib/API/auth.js';
	import NewGoalForm from '$lib/Components/Forms/NewGoalForm.svelte';
	import GoalList from './goalList.svelte';
	import AchievementList from './achievementList.svelte';

	let { data } = $props();

	console.log(data);

	let isAchievementOpen = $state(false);
	let isNewMeetingOpen = $state(false);
	let isLoadingNewMeeting = $state(false);
	let showSelectOrg = $state(false);
	let isLoadingInOrg = $state<string | null>(null);
	let showNewGoal = $state(false);

	onMount(() => {
		trackingStore.pageViewEvent('Dashboard');
	});

	const createNewMeetingMutation = useCreateMeetingMutation();
	const upcomingMeetings = useUpcomingMeetings(data.meetings);
	const loadIntoOrgMutation = useLoginOrgAdminMutation();

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

	async function logIntoOrg(orgID: string) {
		isLoadingInOrg = orgID;
		try {
			await $loadIntoOrgMutation.mutateAsync({ id: orgID });
			goto(`/org/${orgID}`);
		} catch (error) {
			isLoadingInOrg = null;
			toastStore.show({ message: 'There was an error loading into org', type: 'error' });
		}
	}
</script>

<PageContainer className="py-6">
	<p class="font-title text-4xl">Hello, {data.user.firstName}</p>
	<div
		class={`mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 ${data.user.orgAdminLinks.length > 0 ? 'md:grid-cols-5' : 'md:grid-cols-4'}`}
	>
		<DashboardActionButton
			title="Add Achievement"
			subTitle="Take note of your achievements"
			icon={startIcon}
			color="green"
			actionName="Add Achievement Click"
			onClick={() => {
				isAchievementOpen = true;
			}}
		/>

		<DashboardActionButton
			title="Add Goal"
			subTitle="Take note of your achievements"
			icon={trophyIcon}
			color="orange"
			actionName="Add Goal Click"
			premiumAction={true}
			premiumLocked={!useFeatureGate(1, data.user)}
			onClick={() => {
				showNewGoal = true;
			}}
		/>

		<DashboardActionButton
			title="Start Meeting"
			subTitle="Quickly access your cheat sheet for an interview or 1:1"
			color="blue"
			icon={chartIcon}
			disabled={isLoadingNewMeeting}
			actionName="Start Meeting Click"
			premiumAction={true}
			premiumLocked={!useFeatureGate(1, data.user)}
			onClick={() => {
				createNewMeeting();
			}}
		>
			{#if isLoadingNewMeeting}
				<div class="absolute inset-0 flex items-center justify-center">
					<Loader />
				</div>
			{/if}
		</DashboardActionButton>

		<DashboardActionButton
			icon={prepIcon}
			title="Prepare"
			subTitle="Prepare your 1:1, Annual Review or Interview"
			actionName="Prepare Click"
			color="purple"
			href="/prep"
			premiumAction={true}
			premiumLocked={!useFeatureGate(1, data.user)}
		/>

		{#if data.user.orgAdminLinks.length === 1}
			<DashboardActionButton
				title="Manage Organization"
				subTitle="View and manage your organization"
				icon={buildingIcon}
				onClick={() => logIntoOrg(data.user.orgAdminLinks[0].organization.id)}
				actionName="Manage Organization Click"
				color="red"
			>
				{#if isLoadingInOrg == data.user.orgAdminLinks[0].organization.id}
					<div class="absolute inset-0 flex items-center justify-center">
						<Loader />
					</div>
				{/if}
			</DashboardActionButton>
		{:else if data.user.orgAdminLinks.length > 1}
			<DashboardActionButton
				title="Manage Organizations"
				subTitle="View and manage your organization"
				icon={buildingIcon}
				onClick={() => {
					showSelectOrg = true;
				}}
				actionName="Manage Organization Click"
				color="red"
			/>
		{/if}
	</div>

	<div class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
		<div class="bg-surface-100 rounded border-3 border-gray-200 p-4 md:col-span-2">
			{#if useFeatureGate(1, data.user)}
				<GoalList />
			{:else}
				<AchievementList />
			{/if}
		</div>
		<div class="bg-surface-100 rounded border-3 border-gray-200 p-4 md:col-span-2">
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
				{#if ($upcomingMeetings.data || []).length > 0}
					{#each $upcomingMeetings.data || [] as meeting}
						<UpcomingEventRow {...meeting} disableActions={!useFeatureGate(1, data.user)} />
					{/each}
				{:else}
					<InfoBlock
						title="Upcoming Meetings"
						description="To add a new achievement click Add Meeting"
					/>
				{/if}
			</ol>
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
	<NewMeetingForm id="newMeeting" onSuccess={() => (isNewMeetingOpen = false)} />
</Drawer>

<Drawer bind:isOpen={showSelectOrg} title="Select an Organization">
	<div></div>
	<ul role="list" class="divide-y divide-gray-100">
		{#each data.user.orgAdminLinks as orgAdmin}
			<li class="flex justify-between gap-x-6 py-5">
				<button
					onclick={() => {
						logIntoOrg(orgAdmin.organization.id);
					}}
					class="flex min-w-0 gap-x-4 rounded px-2 py-2 hover:bg-gray-200"
				>
					{#if isLoadingInOrg === orgAdmin.organization.id}
						<div
							class="absolute inset-0 inset-x-0 -top-px bottom-0 flex items-center justify-center bg-white/50 p-2"
						>
							<Loader size="md" />
						</div>
					{/if}
					{#if orgAdmin.organization.logoURL}
						<img
							src={orgAdmin.organization.logoURL}
							alt=""
							class="size-12 flex-none rounded-full bg-gray-50"
						/>
					{:else}
						<div
							class="flex size-12 flex-none items-center justify-center overflow-hidden rounded-full bg-gray-50"
						>
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
									d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
								/>
							</svg>
						</div>
					{/if}
					<div class="min-w-0 flex-auto pt-2">
						<p class="text-sm font-semibold text-gray-900">{orgAdmin.organization.name}</p>
					</div>
				</button>
			</li>
		{/each}
	</ul>
</Drawer>

<Drawer bind:isOpen={showNewGoal} title="Add New Goal" saveFormID="new-achievement">
	<NewGoalForm formID="new-achievement" onSuccess={() => (showNewGoal = false)} />
</Drawer>

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

{#snippet buildingIcon()}
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
			d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
		/>
	</svg>
{/snippet}

{#snippet chartPieIcon()}
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
			d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"
		/>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"
		/>
	</svg>
{/snippet}

{#snippet trophyIcon()}
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
			d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
		/>
	</svg>
{/snippet}
