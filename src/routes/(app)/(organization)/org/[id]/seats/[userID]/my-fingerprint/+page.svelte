<script>
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import TwoColumn from '$lib/Components/Containers/TwoColumn.svelte';
	import ChipList from '$lib/Components/FormElements/ChipList.svelte';
	import EducationDetails from '$lib/Components/Forms/EducationDetails.svelte';
	import JobDetails from '$lib/Components/Forms/JobDetails.svelte';
	import InfoBlock from '$lib/Components/InfoBlock.svelte';
	import { trackingStore } from '$lib/Stores/tracking.js';
	import { formatDate } from '$lib/Utils/formatDate';

	const { data } = $props();

	console.log({ myFingerprint: data.myFingerprint });

	let jobs = $state(data.myFingerprint?.jobs || []);
	let education = $state(data.myFingerprint?.education || []);
	// let chipList = $state($skillList.data?.skillList || []);
</script>

{#if data.myFingerprint}
	<TwoColumn title={'My Jobs'}>
		{#snippet subSection()}
			<button
				class="btn btn--primary"
				onclick={() => {
					// addObject('job-positions');
					trackingStore.trackAction('Updated Resume', {
						section: 'Job Position',
						button: 'Add'
					});
				}}
			>
				Add New Job
			</button>
		{/snippet}
		<fieldset disabled class="space-y-4">
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
						<button
							class="btn btn-text--error btn-small"
							onclick={() => {
								// deleteObject('job-positions', job.id);
								trackingStore.trackAction('Updated Resume', {
									section: 'Job Position',
									button: 'Delete'
								});
							}}>Delete</button
						>
						<button
							class="btn btn-text--success btn-small"
							onclick={() => {
								// saveObject('job-positions', job.id);
								trackingStore.trackAction('Updated Resume', {
									section: 'Job Position',
									button: 'Save'
								});
							}}>Save</button
						>
					{/snippet}
				</Card>
			{/each}
		</fieldset>
	</TwoColumn>
	<TwoColumn title={'My Education'}>
		{#snippet subSection()}
			<button
				class="btn btn--primary"
				onclick={() => {
					// addObject('education');
					trackingStore.trackAction('Updated Resume', {
						section: 'Education',
						button: 'Add'
					});
				}}
			>
				Add New Education
			</button>
		{/snippet}
		<div class="space-y-4">
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
						<button
							class="btn btn-text--error btn-small"
							onclick={() => {
								trackingStore.trackAction('Updated Resume', {
									section: 'Education',
									button: 'Delete'
								});
								// deleteObject('education', edu.id);
							}}>Delete</button
						>
						<button
							class="btn btn-text--success btn-small"
							onclick={() => {
								trackingStore.trackAction('Updated Resume', {
									section: 'Education',
									button: 'Save'
								});
								// saveObject('education', edu.id);
							}}>Save</button
						>
					{/snippet}
				</Card>
			{/each}
		</div>
	</TwoColumn>
	<!-- <TwoColumn title={'My Skills'}> -->
	<!-- <Card> -->
	<!-- <ChipList bind:chips={chipList} onChange={saveSkills} /> -->
	<!-- </Card> -->
	<!-- </TwoColumn> -->
{:else}
	<InfoBlock
		title="No Fingerprint"
		description="There was error. Either the user doesnt exist or there was an error fetching the fingerprint"
	/>
{/if}
