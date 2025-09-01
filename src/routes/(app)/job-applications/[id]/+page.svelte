<script lang="ts">
	import {
		useJobApplicationByIDQuery,
		useUpdateJobApplicationMutation
	} from '$lib/API/job-applications.js';
	import Select from '$lib/Components/FormElements/Select.svelte';
	import TextArea from '$lib/Components/FormElements/TextArea.svelte';
	import StatusBadge from '$lib/Components/StatusBadge.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast.js';
	import { trackingStore } from '$lib/Stores/tracking.js';
	import { AppStatusEnum } from '$lib/Utils/AppStatusTypes';
	import { onMount } from 'svelte';

	const { data } = $props();
	let jobDescription = $state(data.application?.jobDescription);

	onMount(() => {
		trackingStore.pageViewEvent('Job Application', { tab: 'Details' });
	});

	let currentJob = useJobApplicationByIDQuery(data.application?.id || '', data.application);
	let editType = $state<string | null>(null);
	let status = $state($currentJob.data?.status || AppStatusEnum.APPLIED);

	let updateJobApp = useUpdateJobApplicationMutation(data.application?.id);

	async function saveNewJobApplication() {
		if (!data.application || !data.application.id) {
			toastStore.show({ message: 'No application to update' });
			return;
		}
		try {
			await $updateJobApp.mutateAsync({
				id: data.application.id,
				title: data.application.title || '',
				company: data.application.company || '',
				status,
				jobDescription: jobDescription || null
			});
			editType = null;
		} catch (error) {
			toastStore.show({ message: 'Error saving job application' });
		}
	}
</script>

<div class="border-t border-white/5">
	<dl class="divide-y divide-white/5">
		<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
			<dt class="flex">
				<p class="text-sm font-medium text-gray-600">
					Application Status

					{#if editType === 'status'}
						<button class="btn btn-small btn-text--primary" onclick={saveNewJobApplication}>
							Save
						</button>
					{:else}
						<button class="btn btn-small btn-text--primary" onclick={() => (editType = 'status')}>
							Edit
						</button>
					{/if}
				</p>
			</dt>
			<dd class="mt-1 text-sm/6 text-gray-800 sm:col-span-2 sm:mt-0">
				{#if editType === 'status'}
					<Select
						bind:value={status}
						hideLabel
						id="status"
						label="Application Status"
						options={[
							{ id: AppStatusEnum.APPLIED, label: 'Applied' },
							{ id: AppStatusEnum.INTERVIEWING, label: 'Interviewing' },
							{ id: AppStatusEnum.NEGOTIATION, label: 'Negotiation' },
							{ id: AppStatusEnum.ACCEPTED, label: 'Accepted' },
							{ id: AppStatusEnum.REJECTED, label: 'Rejected' },
							{ id: AppStatusEnum.GHOST, label: 'Ghosted' },
							{ id: AppStatusEnum.ARCHIVE, label: 'Archived' }
						]}
					/>
				{:else}
					<StatusBadge status={$currentJob.data?.status} />
				{/if}
			</dd>
		</div>
		<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
			<dt class="flex">
				<p class="text-sm font-medium text-gray-600">
					Job Description

					{#if editType === 'jobDescription'}
						<button class="btn btn-small btn-text--primary" onclick={saveNewJobApplication}>
							Save
						</button>
					{:else}
						<button
							class="btn btn-small btn-text--primary"
							onclick={() => (editType = 'jobDescription')}
						>
							Edit
						</button>
					{/if}
				</p>
			</dt>
			<dd class="mt-1 text-sm/6 whitespace-pre-wrap text-gray-800 sm:col-span-2 sm:mt-0">
				{#if editType === 'jobDescription'}
					<TextArea id="desciption" bind:value={jobDescription} rows={5} hideLabel />
				{:else}
					{jobDescription}
				{/if}
			</dd>
		</div>
	</dl>
</div>
