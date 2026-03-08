<script lang="ts">
	import { useAchievementActivity } from '$lib/API/achievements';
	import AchievementActivity from '$lib/Components/AchievementActivity/AchievementActivity.svelte';
	import StreakBanner from '$lib/Components/AchievementActivity/StreakBanner.svelte';
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import DashboardActionButton from '$lib/Components/DashboardActionButton.svelte';
	import Loader from '$lib/Components/Loader.svelte';
	import { useFeatureGate } from '$lib/Utils/featureGate';
	let { data } = $props();

	const activity = useAchievementActivity();

	const hasStarterFeatures = useFeatureGate(1, data.user);
	const hasProFeatures = useFeatureGate(2, data.user);
	let isAchievementOpen = $state(false);
	let isNewMeetingOpen = $state(false);
	let isLoadingNewMeeting = $state(false);
	let showSelectOrg = $state(false);
	let isLoadingInOrg = $state<string | null>(null);
</script>

<PageContainer className="py-6">
	<div class="flex flex-col items-center justify-between md:flex-row">
		<p class="font-title text-4xl">Hello, {data.user.firstName}</p>

		<div class="py-2">
			<StreakBanner streak={5} />
		</div>
	</div>

	<dl
		class="mt-5 grid grid-cols-1 divide-gray-200 overflow-hidden rounded-lg bg-white shadow-sm md:grid-cols-3 md:divide-x md:divide-y-0"
	>
		<div class="px-4 py-5 sm:p-6">
			<dt class="text-base font-normal text-gray-900">Achievements</dt>
			<dd class="mt-1 flex items-baseline justify-between md:block lg:flex">
				<div class="text-accent font-title flex items-baseline text-4xl font-semibold">40</div>
			</dd>
		</div>
		<div class="px-4 py-5 sm:p-6">
			<dt class="text-base font-normal text-gray-900">Achievement per week</dt>
			<dd class="mt-1 flex items-baseline justify-between md:block lg:flex">
				<div class="text-accent font-title flex items-baseline text-4xl font-semibold">
					2.6
					<span class="ml-2 text-sm font-medium text-gray-500">/week</span>
				</div>
			</dd>
		</div>
		<div class="px-4 py-5 sm:p-6">
			<dt class="text-base font-normal text-gray-900">Goals</dt>
			<dd class="mt-1 flex items-baseline justify-between md:block lg:flex">
				<div class="text-accent font-title flex items-baseline text-4xl font-semibold">2</div>
			</dd>
		</div>
	</dl>

	<div class="grid grid-cols-6 pt-4">
		<div class="col-span-3">
			<h2 class="font-title text-3 font-semibold">You Achievement History</h2>
			<AchievementActivity weekData={$activity.data} />
		</div>
		<div class="col-span-3">
			<Card headline="Quick Actions">
				<div class="grid grid-cols-2 gap-2">
					<DashboardActionButton
						title="Add Achievement"
						subTitle="Take note of your achievements"
						icon={startIcon}
						color="green"
						actionName="Add Achievement Click"
						premiumLocked={!hasStarterFeatures}
						onClick={() => {
							isAchievementOpen = true;
						}}
					/>

					<DashboardActionButton
						icon={trophyIcon}
						title="Goals"
						subTitle="View and create your goals"
						href="/goals"
						actionName="Goals Click"
						color="orange"
						premiumLocked={!hasProFeatures}
					/>

					<DashboardActionButton
						title="Start Meeting"
						subTitle="Quickly access your cheat sheet for an interview or 1:1"
						color="blue"
						icon={chartIcon}
						disabled={isLoadingNewMeeting}
						actionName="Start Meeting Click"
						premiumAction={true}
						premiumLocked={!hasProFeatures}
						onClick={() => {
							// createNewMeeting();
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
						premiumLocked={!hasProFeatures}
					/>

					{#if data.user.orgAdminLinks.length === 1}
						<DashboardActionButton
							title="Manage Organization"
							subTitle="View and manage your organization"
							icon={buildingIcon}
							onClick={() => {
								// logIntoOrg(data.user.orgAdminLinks[0].organization.id)
							}}
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
			</Card>
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
