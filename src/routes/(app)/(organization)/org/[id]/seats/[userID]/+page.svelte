<script>
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import NavPillButtons from '$lib/Components/Header/NavPillButtons.svelte';
	import TabNav from '$lib/Components/Header/TabNav.svelte';
	import InfoBlock from '$lib/Components/InfoBlock.svelte';
	import { formatDate } from '$lib/Utils/formatDate';

	const { data } = $props();

	console.log(data);
</script>

<PageContainer className="py-6">
	<div class="flex justify-between">
		<h2 class="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
			{data.myFingerprint?.user.firstName || 'User'}
		</h2>
	</div>
	<TabNav
		options={[
			{ path: 'my-fingerprint', label: 'My Fingerprint' },
			{ path: 'achievements', label: 'Achievements' },
			{ path: 'meetings', label: 'Meetings' }
		]}
	/>
	{#if data.myFingerprint}
		{#each data.myFingerprint.jobs as job}
			<dl class="grid grid-cols-1 sm:grid-cols-2">
				<div class="px-4 py-6 sm:col-span-1 sm:px-0">
					<dt class="text-sm/6 font-medium text-gray-900">Title</dt>
					<dd class="mt-1 text-sm/6 text-gray-700 sm:mt-2">{job.name}</dd>
				</div>
				<div class="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
					<dt class="text-sm/6 font-medium text-gray-900">Company</dt>
					<dd class="mt-1 text-sm/6 text-gray-700 sm:mt-2">{job.company || 'N/A'}</dd>
				</div>
				<div class="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
					<dt class="text-sm/6 font-medium text-gray-900">Location</dt>
					<dd class="mt-1 text-sm/6 text-gray-700 sm:mt-2">{job.location || 'N/A' || 'N/A'}</dd>
				</div>
				<div class="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
					<dt class="text-sm/6 font-medium text-gray-900">Date</dt>
					<dd class="mt-1 text-sm/6 text-gray-700 sm:mt-2">
						{formatDate(job.startDate)} - {job.currentPosition
							? 'Current'
							: formatDate(job.endDate)}
					</dd>
				</div>
				<div class="border-t border-gray-100 px-4 py-6 sm:col-span-2 sm:px-0">
					<dt class="text-sm/6 font-medium text-gray-900">Summary</dt>
					<dd class="mt-1 text-sm/6 whitespace-pre-wrap text-gray-700 sm:mt-2">
						{job.description || 'N/A'}
					</dd>
				</div>
			</dl>
			<div class="flex items-center">
				<div aria-hidden="true" class="w-full border-t border-gray-300"></div>
			</div>
		{/each}
		{#each data.myFingerprint.education as edu}
			<dl class="grid grid-cols-1 sm:grid-cols-2">
				<div class="px-4 py-6 sm:col-span-1 sm:px-0">
					<dt class="text-sm/6 font-medium text-gray-900">Degree</dt>
					<dd class="mt-1 text-sm/6 text-gray-700 sm:mt-2">{edu.degree || 'N/A'}</dd>
				</div>
				<div class="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
					<dt class="text-sm/6 font-medium text-gray-900">Institution</dt>
					<dd class="mt-1 text-sm/6 text-gray-700 sm:mt-2">{edu.institution || 'N/A'}</dd>
				</div>
				<div class="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
					<dt class="text-sm/6 font-medium text-gray-900">Date</dt>
					<dd class="mt-1 text-sm/6 text-gray-700 sm:mt-2">
						{formatDate(edu.startDate)} - {edu.currentPosition
							? 'Current'
							: formatDate(edu.endDate)}
					</dd>
				</div>
				<div class="border-t border-gray-100 px-4 py-6 sm:col-span-2 sm:px-0">
					<dt class="text-sm/6 font-medium text-gray-900">Summary</dt>
					<dd class="mt-1 text-sm/6 whitespace-pre-wrap text-gray-700 sm:mt-2">
						{edu.description || 'N/A'}
					</dd>
				</div>
			</dl>
			<div class="flex items-center">
				<div aria-hidden="true" class="w-full border-t border-gray-300"></div>
			</div>
		{/each}
	{:else}
		<InfoBlock
			title="No Fingerprint"
			description="There was error. Either the user doesnt exist or there was an error fetching the fingerprint"
		/>
	{/if}
</PageContainer>
