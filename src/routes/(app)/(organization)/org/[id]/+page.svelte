<script lang="ts">
	import { useOrgDashboard } from '$lib/API/dashboard.js';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import DashboardActionButton from '$lib/Components/DashboardActionButton.svelte';
	import DashboardStat from '$lib/Components/DashboardStat.svelte';
	import Loader from '$lib/Components/Loader.svelte';
	import { trackingStore } from '$lib/Stores/tracking';
	import { onMount } from 'svelte';
	import type { ChartConfiguration } from 'chart.js';
	import Chart from '$lib/Components/Chart.svelte';
	import { copyTextToClipboard } from '$lib/Utils/copyTextToClipboard.js';
	import { toastStore } from '$lib/Components/Toasts/toast.js';

	onMount(() => {
		trackingStore.pageViewEvent('Org Dashboard');
	});
	const { data } = $props();

	const orgReport = useOrgDashboard(data.org?.id || '');

	console.log({ data, orgReport: $orgReport.data });

	async function copySignUpLink() {
		try {
			await copyTextToClipboard(`https://careerfingerprint.app/get-started`);
			toastStore.show({ message: 'Link Copied' });
		} catch (error) {
			toastStore.show({ message: 'Could not get sign up link', type: 'error' });
		}
	}
</script>

<PageContainer className="py-6">
	<p class="font-title text-4xl">Hello, {data.org?.name}</p>
	<div class="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
		<DashboardActionButton
			icon={usersIcon}
			actionName="Seat Management Click"
			title="Seat Management"
			subTitle="Manage Current Users"
			color="green"
			href={`/org/${data.org?.id}/seats`}
		/>
		<DashboardActionButton
			icon={linkIcon}
			actionName="Share Link Click"
			title="Copy Sign Up Link"
			subTitle="Share the copy link to allow people to sign up"
			color="blue"
			onClick={() => {
				trackingStore.trackAction('Org Share Sign Up Link');
				copySignUpLink();
			}}
		/>
		<DashboardActionButton
			icon={usersIcon}
			actionName="Manage Admin Click"
			title="Manage Administrators"
			subTitle="Add and remove the admins on this account"
			color="purple"
			href={`/org/${data.org?.id}/admins`}
		/>
		<DashboardActionButton
			icon={gearIcon}
			actionName="Org Click"
			title="Org Settings"
			subTitle="Manage this Organizations"
			color="red"
			href={`/org/${data.org?.id}/settings`}
		/>
	</div>
	<p class="font-title mt-3 text-2xl">At a Glace</p>
	{#if $orgReport.isLoading}
		<div class="flex justify-center">
			<Loader />
		</div>
	{:else}
		<div class="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
			<DashboardStat
				number={$orgReport?.data?.seatUtilization?.seatsUsed || 0}
				ofNumber={$orgReport?.data?.seatUtilization?.seatLimit || 0}
				name="Active Subscriptions"
			/>
			<div>
				<p>Users who are active</p>
				{@render pieChart(
					$orgReport?.data?.activeVSInActive?.activeUsers,
					$orgReport?.data?.activeVSInActive?.inactiveUsers
				)}
			</div>
		</div>
	{/if}
</PageContainer>

{#snippet usersIcon()}
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
			d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
		/>
	</svg>
{/snippet}

{#snippet linkIcon()}
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
			d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
		/>
	</svg>
{/snippet}

{#snippet gearIcon()}
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
			d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
		/>
		<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
	</svg>
{/snippet}

{#snippet pieChart(active: 0, inActive: 0)}
	<Chart
		config={{
			type: 'pie',
			data: {
				labels: ['Active', 'InActive'],
				datasets: [
					{
						label: 'Active Users',
						data: [active, inActive],
						borderWidth: 1
					}
				]
			},
			options: {
				plugins: { legend: { display: false } },
				responsive: true
			}
		}}
	/>
{/snippet}
