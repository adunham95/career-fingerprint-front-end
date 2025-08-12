<script lang="ts">
	import Select from '$lib/Components/FormElements/Select.svelte';
	import TextArea from '$lib/Components/FormElements/TextArea.svelte';
	import StatusBadge from '$lib/Components/StatusBadge.svelte';
	import { AppStatusEnum } from '$lib/Utils/AppStatusTypes';

	const { data } = $props();

	let editType = $state<string | null>(null);
</script>

<div class="border-t border-white/5">
	<dl class="divide-y divide-white/5">
		{#if data.application?.jobDescription}
			<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
				<dt class="flex">
					<p class="text-sm font-medium text-gray-600">
						Job Description

						{#if editType === 'jobDescription'}
							<button class="btn btn-small btn-text--primary" onclick={() => (editType = null)}>
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
						<TextArea id="desciption" value={data.application.jobDescription} rows={5} hideLabel />
					{:else}
						{data.application?.jobDescription}
					{/if}
				</dd>
			</div>
		{/if}
		<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
			<dt class="flex">
				<p class="text-sm font-medium text-gray-600">
					Application Status

					{#if editType === 'status'}
						<button class="btn btn-small btn-text--primary" onclick={() => (editType = null)}>
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
						value={data.application?.status}
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
					<StatusBadge status={data.application?.status} />
				{/if}
			</dd>
		</div>
	</dl>
</div>
