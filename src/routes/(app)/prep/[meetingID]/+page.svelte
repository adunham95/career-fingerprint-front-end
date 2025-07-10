<script lang="ts">
	import ContactsChecklist from '$lib/Components/ContactsChecklist.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import TextArea from '$lib/Components/FormElements/TextArea.svelte';
	import AssignToJob from '$lib/Components/Forms/AssignToJob.svelte';
	import StepList from '$lib/Components/StepList.svelte';
	import { getSteps } from './steps.js';

	const { data } = $props();

	console.log(data);
</script>

<PageContainer>
	<StepList currentStep={0} steps={getSteps(data.meetingID)} />
	<div class="mt-8 flex justify-between">
		<h1 class="font-title text-2xl">Meeting Set Up</h1>
		<div>
			<button disabled class="btn btn-text--disabled">Prev Step</button>
			<a href={`/prep/${data.meetingID}/details`} class="btn btn-text--primary">Next Step</a>
		</div>
	</div>

	<div class="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
		<div>
			{#if data.meeting.type === 'interview'}
				{#if data.meeting.jobAppID}
					<TextArea id="" label="Job Description" rows={12} />
					<div class="flex justify-end pt-4">
						<button class="btn btn--primary">Updated Job Description</button>
					</div>
				{:else}
					<AssignToJob />
				{/if}
			{/if}
		</div>
		<div>
			<ContactsChecklist
				title="Add Contacts"
				contacts={[{ id: '1', name: 'John Smith', email: 'jsmith@cf.com' }]}
			/>
		</div>
	</div>
</PageContainer>
