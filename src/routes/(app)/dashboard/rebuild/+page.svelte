<script lang="ts">
	import { goto } from '$app/navigation';
	import { useAchievementActivity, useAchievementStreak } from '$lib/API/achievements';
	import { useCreateMeetingMutation } from '$lib/API/meeting.js';
	import AchievementActivity from '$lib/Components/AchievementActivity/AchievementActivity.svelte';
	import StreakBanner from '$lib/Components/AchievementActivity/StreakBanner.svelte';
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import DashboardActionButtonV2 from '$lib/Components/DashboardActionButtonV2.svelte';
	import Loader from '$lib/Components/Loader.svelte';
	import Drawer from '$lib/Components/Overlays/Drawer.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast.js';
	import { trackingStore } from '$lib/Stores/tracking.js';
	import { useFeatureGate } from '$lib/Utils/featureGate';
	import NewAchievementForm from '$lib/Components/Forms/AchievementForm.svelte';
	import { onMount } from 'svelte';
	import { useGetUserStats } from '$lib/API/user.js';
	let { data } = $props();

	onMount(() => {
		trackingStore.pageViewEvent('Dashboard');
	});

	const activity = useAchievementActivity();
	const streak = useAchievementStreak();
	const createNewMeetingMutation = useCreateMeetingMutation();
	const stats = useGetUserStats();

	const hasCreateAchievementFeature = useFeatureGate('achievements:create', data.user);
	const hasGoalFeature = useFeatureGate('goals:read', data.user);
	const hasMeetingFeature = useFeatureGate('meeting:view', data.user);
	const hasMeetingPrepFeature = useFeatureGate('meeting:prep', data.user);

	let isAchievementOpen = $state(false);
	let isLoadingNewMeeting = $state(false);

	async function createNewMeeting() {
		isLoadingNewMeeting = true;
		try {
			const newMeeting = await $createNewMeetingMutation.mutateAsync({
				time: new Date().toISOString()
			});
			goto(`/cheatsheet/${newMeeting?.id}`);
		} catch (error) {
			isLoadingNewMeeting = false;
			toastStore.show({ message: 'Could not start the meeting. Try again.', type: 'error' });
		}
	}
</script>

<PageContainer className="py-6">
	<div class="flex flex-col items-center md:flex-row">
		<p class="font-title flex-2 text-4xl">Hello, {data.user.firstName}</p>

		<div class="block w-full flex-1 py-2">
			<StreakBanner streak={$streak.data} />
		</div>
	</div>

	<Card className="mt-5 p-0">
		<dl
			class="grid grid-cols-1 divide-gray-200 overflow-hidden md:grid-cols-2 md:divide-x md:divide-y-0"
		>
			<div class="px-4 py-5 sm:p-6">
				<dt class="text-base font-normal text-gray-900">Achievements</dt>
				<dd class="mt-1 flex items-baseline justify-between md:block lg:flex">
					{#if $stats.isLoading}
						<Loader size="md" />
					{:else if $stats.isError}
						<span class="text-sm text-gray-400">Unavailable</span>
					{:else}
						<div class="text-accent font-title flex items-baseline text-4xl font-semibold">
							{$stats.data?.totalAchievementsBracket ?? '--'}
						</div>
					{/if}
				</dd>
			</div>
			<!-- <div class="px-4 py-5 sm:p-6">
			<dt class="text-base font-normal text-gray-900">Achievement per week</dt>
			<dd class="mt-1 flex items-baseline justify-between md:block lg:flex">
				{#if $stats.isLoading}
					<div class="flex justify-center">
						<Loader size="md" />
					</div>
				{:else}
				<div class="text-accent font-title flex items-baseline text-4xl font-semibold">
						2.6
						<span class="ml-2 text-sm font-medium text-gray-500">/week</span>
					</div>
				{/if}
			</dd>
		</div> -->
			<div class="px-4 py-5 sm:p-6">
				<dt class="text-base font-normal text-gray-900">Goals</dt>
				<dd class="mt-1 flex items-baseline justify-between md:block lg:flex">
					{#if $stats.isLoading}
						<Loader size="md" />
					{:else if $stats.isError}
						<span class="text-sm text-gray-400">Unavailable</span>
					{:else}
						<div class="text-accent font-title flex items-baseline text-4xl font-semibold">
							{$stats.data?.activeGoals ?? '--'}
						</div>
					{/if}
				</dd>
			</div>
		</dl>
	</Card>

	<div class="grid grid-cols-1 gap-4 pt-4 md:grid-cols-6">
		<div class="col-span-3">
			<Card headline="Your Achievement History">
				<AchievementActivity weekData={$activity.data} />
			</Card>
		</div>
		<div class="col-span-3">
			<Card headline="Quick Actions">
				<div class="grid grid-cols-2 gap-2">
					<DashboardActionButtonV2
						title="Add Achievement"
						subTitle="Take note of your achievements"
						icon={startIcon}
						color="green"
						actionName="Add Achievement Click"
						premiumLocked={!hasCreateAchievementFeature}
						onClick={() => {
							isAchievementOpen = true;
						}}
					/>

					<DashboardActionButtonV2
						icon={trophyIcon}
						title="Goals"
						subTitle="View and create your goals"
						href="/goals"
						actionName="Goals Click"
						color="orange"
						premiumLocked={!hasGoalFeature}
					/>

					<DashboardActionButtonV2
						title="Start Meeting"
						subTitle="Quickly access your cheat sheet for an interview or 1:1"
						color="blue"
						icon={chartIcon}
						disabled={isLoadingNewMeeting}
						actionName="Start Meeting Click"
						premiumAction={true}
						premiumLocked={!hasMeetingFeature}
						onClick={() => {
							createNewMeeting();
						}}
					>
						{#if isLoadingNewMeeting}
							<div class="absolute inset-0 flex items-center justify-center">
								<Loader />
							</div>
						{/if}
					</DashboardActionButtonV2>

					<DashboardActionButtonV2
						icon={prepIcon}
						title="Prepare"
						subTitle="Prepare your 1:1, Annual Review or Interview"
						actionName="Prepare Click"
						color="purple"
						href="/prep"
						premiumAction={true}
						premiumLocked={!hasMeetingPrepFeature}
					/>
				</div>
			</Card>
		</div>
	</div>
</PageContainer>

<Drawer
	bind:isOpen={isAchievementOpen}
	title="Add Achievement"
	subTitle="Add an a achievement here"
	saveFormID="newAchievement"
>
	{#if isAchievementOpen}
		<NewAchievementForm id="newAchievement" onSuccess={() => (isAchievementOpen = false)} user={data.user} />
	{/if}
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
