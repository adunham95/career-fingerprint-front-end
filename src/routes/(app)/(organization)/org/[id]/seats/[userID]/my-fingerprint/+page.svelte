<script lang="ts">
	import {
		resumeObjectTypeMap,
		useAddClientResumeItemMutation,
		useDeleteClientResumeItemMutation,
		useGetClientFingerprint,
		useUpdateClientResumeItemMutation
	} from '$lib/API/resume.js';
	import Card from '$lib/Components/Containers/Card.svelte';
	import TwoColumn from '$lib/Components/Containers/TwoColumn.svelte';
	import EducationDetails from '$lib/Components/Forms/EducationDetails.svelte';
	import JobDetails from '$lib/Components/Forms/JobDetails.svelte';
	import InfoBlock from '$lib/Components/InfoBlock.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast.js';
	import { trackingStore } from '$lib/Stores/tracking.js';
	import { permissionGate } from '$lib/Utils/permissionGate.js';
	import type { Education } from '../../../../../../../../app.js';
	import type { JobPosition } from '../../../../../../../../app.js';

	const { data } = $props();

	const userID = data.currentUser?.id || 0;

	let jobs = $state(data.myFingerprint?.jobs || []);
	let education = $state(data.myFingerprint?.education || []);

	let addResumeObject = useAddClientResumeItemMutation(userID);
	let updateResumeObject = useUpdateClientResumeItemMutation(userID);
	let deleteResumeItem = useDeleteClientResumeItemMutation(userID);

	async function addObject(type: keyof typeof resumeObjectTypeMap) {
		try {
			let addedObject = await $addResumeObject.mutateAsync({ type, userID });

			console.log(addedObject, 'type', type);

			switch (type) {
				case 'job-positions':
					jobs.push(addedObject as JobPosition);
					break;
				case 'education':
					education.push(addedObject as Education);
					break;

				default:
					break;
			}

			toastStore.show({
				type: 'success',
				message: `${resumeObjectTypeMap[type]} Added`
			});
		} catch (error) {
			toastStore.show({
				type: 'error',
				message: `Failed to add ${resumeObjectTypeMap[type]}`
			});
		}
	}

	function getObjectData(
		type: keyof typeof resumeObjectTypeMap,
		id: string
	): JobPosition | Education {
		switch (type) {
			case 'job-positions':
				let jobData = jobs.find((j) => j.id === id);
				if (!jobData) throw 'missing job';
				let job = { ...jobData };
				console.log({ job });
				if ('name' in job) {
					job as JobPosition;
					return {
						name: job.name,
						company: job.company,
						location: job.location,
						description: job.description,
						startDate: job.startDate ? new Date(job.startDate).toISOString() : null,
						endDate: job.endDate ? new Date(job.endDate).toISOString() : null,
						currentPosition: job.currentPosition,
						bulletPoints: job.bulletPoints
					} as JobPosition;
				}
				return {} as JobPosition;
			case 'education':
				let item = education.find((j) => j.id === id);
				if (!item) throw 'missing education';
				if ('degree' in item) {
					item as Education;
					return {
						degree: item.degree,
						institution: item.institution,
						description: item.description,
						startDate: item.startDate ? new Date(item.startDate).toISOString() : null,
						endDate: item.endDate ? new Date(item.endDate).toISOString() : null,
						currentPosition: item.currentPosition,
						bulletPoints: item.bulletPoints
					} as Education;
				}
				return {} as Education;
			default:
				return {} as JobPosition;
		}
	}

	async function saveObject(type: keyof typeof resumeObjectTypeMap, id: string) {
		try {
			let item = getObjectData(type, id);
			console.log({ item });
			await $updateResumeObject.mutateAsync({
				type,
				itemID: id,
				item,
				userID
			});
			toastStore.show({
				type: 'success',
				message: `${resumeObjectTypeMap[type]} saved`
			});
		} catch (error) {
			toastStore.show({
				type: 'error',
				message: `Error updating ${resumeObjectTypeMap[type]}`
			});
		}
	}

	async function deleteObject(type: keyof typeof resumeObjectTypeMap, id: string) {
		try {
			let deletedObject = await $deleteResumeItem.mutateAsync({ type, itemID: id, userID });

			switch (type) {
				case 'job-positions':
					jobs = jobs?.filter((j) => j.id !== deletedObject?.id);
					break;
				case 'education':
					education = education?.filter((j) => j.id !== deletedObject?.id);
					break;

				default:
					break;
			}
			toastStore.show({
				type: 'success',
				message: `${resumeObjectTypeMap[type]} Deleted`
			});
		} catch (error) {
			toastStore.show({
				type: 'error',
				message: `Failed to delete ${resumeObjectTypeMap[type]}`
			});
		}
	}
</script>

{#if data.myFingerprint}
	<TwoColumn title={'My Jobs'}>
		{#snippet subSection()}
			{#if permissionGate(['career:edit'], data.myPermissions)}
				<button
					class="btn btn--primary"
					onclick={() => {
						addObject('job-positions');
						trackingStore.trackAction('Updated Resume', {
							section: 'Job Position',
							button: 'Add'
						});
					}}
				>
					Add New Job
				</button>
			{/if}
		{/snippet}
		<fieldset disabled={!permissionGate(['career:edit'], data.myPermissions)} class="space-y-4">
			{#if jobs.length === 0}
				<InfoBlock
					title="No Jobs"
					description="No Jobs to show. Click Add New Job to add a new job"
				/>
			{/if}
			{#each jobs || [] as job, idx}
				<Card contentClassName="space-y-2 px-4 py-4 ">
					<JobDetails bind:job={jobs[idx]} {idx} />
					{#snippet actions()}
						{#if permissionGate(['career:edit'], data.myPermissions)}
							<button
								class="btn btn-text--error btn-small"
								onclick={() => {
									deleteObject('job-positions', job.id);
									trackingStore.trackAction('Updated Resume', {
										section: 'Job Position',
										button: 'Delete'
									});
								}}
							>
								Delete
							</button>
							<button
								class="btn btn-text--success btn-small"
								onclick={() => {
									saveObject('job-positions', job.id);
									trackingStore.trackAction('Updated Resume', {
										section: 'Job Position',
										button: 'Save'
									});
								}}>Save</button
							>
						{:else}
							<button class="btn btn-text--disabled btn-small" disabled> Save </button>
						{/if}
					{/snippet}
				</Card>
			{/each}
		</fieldset>
	</TwoColumn>
	<TwoColumn title={'My Education'}>
		{#snippet subSection()}
			{#if permissionGate(['career:edit'], data.myPermissions)}
				<button
					class="btn btn--primary"
					onclick={() => {
						addObject('education');
						trackingStore.trackAction('Updated Resume', {
							section: 'Education',
							button: 'Add'
						});
					}}
				>
					Add New Education
				</button>
			{/if}
		{/snippet}
		<fieldset disabled={!permissionGate(['career:edit'], data.myPermissions)} class="space-y-4">
			{#if education.length === 0}
				<InfoBlock
					title="No Education"
					description="No Education to show. Click Add New Education to add a new education"
				/>
			{/if}
			{#each education || [] as edu, idx}
				<Card contentClassName="space-y-2 px-4 py-4">
					<EducationDetails bind:education={education[idx]} {idx} />
					{#snippet actions()}
						{#if permissionGate(['career:edit'], data.myPermissions)}
							<button
								class="btn btn-text--error btn-small"
								onclick={() => {
									deleteObject('education', edu.id);
									trackingStore.trackAction('Updated Resume', {
										section: 'Education',
										button: 'Delete'
									});
								}}
							>
								Delete
							</button>
							<button
								class="btn btn-text--success btn-small"
								onclick={() => {
									trackingStore.trackAction('Updated Resume', {
										section: 'Education',
										button: 'Save'
									});
									saveObject('education', edu.id);
								}}>Save</button
							>
						{:else}
							<button class="btn btn-text--disabled btn-small" disabled> Save </button>
						{/if}
					{/snippet}
				</Card>
			{/each}
		</fieldset>
	</TwoColumn>
{:else}
	<InfoBlock
		title="No Fingerprint"
		description="There was error. Either the user doesnt exist or there was an error fetching the fingerprint"
	/>
{/if}
