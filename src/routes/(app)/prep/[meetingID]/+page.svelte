<script lang="ts">
	import ContactsChecklist from '$lib/Components/ContactsChecklist.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import TextArea from '$lib/Components/FormElements/TextArea.svelte';
	import StepList from '$lib/Components/StepList.svelte';
	import { getSteps } from './steps.js';

	const { data } = $props();

	console.log(data);
</script>

<PageContainer>
	<StepList currentStep={0} steps={getSteps(data.meetingID)} />
	<h1 class="font-title mt-8 text-2xl">Meeting Details</h1>

	<div class="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
		<TextArea id="" label="Job Description" rows={12} />
		<div>
			<ContactsChecklist
				title="Add Contacts"
				contacts={[{ id: '1', name: 'John Smith', email: 'jsmith@cf.com' }]}
			/>
		</div>
	</div>
</PageContainer>
