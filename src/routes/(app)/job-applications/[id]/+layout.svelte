<script>
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import TabNav from '$lib/Components/Header/TabNav.svelte';
	import StepTracker from './stepTracker.svelte';

	const { children, data } = $props();
</script>

<PageContainer>
	<StepTracker currentStepName={data.application?.status} />
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="sm:flex sm:items-end sm:space-x-5">
			<div class="sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
				<div class="mt-6 min-w-0 flex-1 sm:hidden md:block">
					<h1 class="truncate text-2xl font-bold text-gray-900">{data.application?.title}</h1>
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
						<img
							src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${data.application?.companyURL}&size=128`}
							alt="Company Logo"
							class="size-full object-cover"
						/>
					</div>
					<div class="flex-auto">
						<dd class="mt-1 text-base font-semibold text-gray-700">{data.application?.company}</dd>
					</div>
				</dl>
			</Card>
			<h2 class="btn btn-text--primary"><a href=""> Resume A </a></h2>
		</div>
	</div>
</PageContainer>
