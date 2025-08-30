<script>
	import { goto } from '$app/navigation';
	import { useJobApplicationByIDQuery } from '$lib/API/job-applications';
	import { useCreateJobPositionFromApp } from '$lib/API/job-positions';
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import TabNav from '$lib/Components/Header/TabNav.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast';
	import { trackingStore } from '$lib/Stores/tracking';
	import { AppStatusEnum } from '$lib/Utils/AppStatusTypes';
	import StepTracker from './stepTracker.svelte';

	const { children, data } = $props();

	let isMigrating = $state(false);

	let currentJob = useJobApplicationByIDQuery(data.application?.id || '', data.application);
	let migrateJobApp = useCreateJobPositionFromApp();

	async function loadMigrateJobApp() {
		isMigrating = true;
		if (!data.application?.id || data.application?.id === null) {
			toastStore.show({ message: 'Failed to add to resume', type: 'error' });
		}
		try {
			await $migrateJobApp.mutateAsync(data.application?.id || '');
			toastStore.show({ message: 'Added to resume', type: 'success' });
			isMigrating = false;
			goto('/my-fingerprint');
		} catch (error) {
			toastStore.show({ message: 'Failed to add to resume', type: 'error' });
			isMigrating = false;
		}
	}
</script>

<PageContainer>
	<StepTracker currentStepName={$currentJob?.data?.status || AppStatusEnum.APPLIED} />
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="sm:flex sm:items-end sm:space-x-5">
			<div class="sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
				<div class="mt-6 min-w-0 flex-1 sm:hidden md:block">
					<h1 class="truncate text-2xl font-bold text-gray-900">{$currentJob?.data?.title}</h1>
				</div>
				<div
					class="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4"
				></div>
			</div>
		</div>
	</div>

	<div class="grid gap-4 pt-4 lg:grid-cols-3">
		<div class=" pb-4 lg:col-span-2 lg:row-span-2 lg:row-end-2">
			<TabNav
				options={[
					{ path: `/job-applications/${data.application?.id}`, label: 'Details' },
					{ path: `/job-applications/${data.application?.id}/meetings`, label: 'Meetings' },
					{ path: `/job-applications/${data.application?.id}/cover-letter`, label: 'Cover Letter' }
				]}
			/>
			<div
				class=" border-t-0 px-4 py-4 shadow-xs ring-1 ring-gray-900/5 sm:mx-0 sm:rounded-lg sm:rounded-t-none sm:px-8"
			>
				<div>{@render children?.()}</div>
			</div>
		</div>
		<div class="space-y-4">
			<Card>
				<dl class="flex flex-wrap">
					<div class="mr-2 size-14 shrink-0 overflow-hidden rounded p-1">
						{#if $currentJob?.data?.companyURL}
							<img
								src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${$currentJob?.data?.companyURL}&size=128`}
								alt="Company Logo"
								class="size-full object-cover"
							/>
						{:else}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-full"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
								/>
							</svg>
						{/if}
					</div>
					<div class="flex-auto">
						<dd class="mt-1 text-base font-semibold text-gray-700">{$currentJob?.data?.company}</dd>
					</div>
				</dl>
			</Card>

			{#if $currentJob.data?.status === AppStatusEnum.ACCEPTED}
				<div class=" bg-surface-500 border-success-400 border-2 sm:rounded-lg">
					<div class="px-4 py-5 sm:p-6">
						<h3 class="text-base font-semibold text-gray-900">Congratulations!</h3>
						<div class="mt-2 max-w-xl text-sm text-gray-500">
							{#if $currentJob.data.migrated}
								<p>
									You have successfully gotten a job! You have already added this to your resume.
								</p>
							{:else}
								<p>
									You have successfully gotten a job! Would you like to add this job to your resume
									now?
								</p>
							{/if}
						</div>
						{#if !$currentJob.data.migrated}
							<div class="mt-5">
								<button
									type="button"
									class="btn btn-outline--primary inline-flex"
									disabled={isMigrating}
									onclick={() => {
										trackingStore.trackAction('Migrate Job Application Click');
										loadMigrateJobApp();
									}}
								>
									Add to Resume
								</button>
							</div>
						{/if}
					</div>
				</div>
			{/if}
			<!-- <h2 class="btn btn-text--primary"><a href=""> Resume A </a></h2> -->
		</div>
	</div>
</PageContainer>
