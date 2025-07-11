<script lang="ts">
	import EventDetails from '$lib/Components/Calender/EventDetails.svelte';
	import ContactsChecklist from '$lib/Components/ContactsChecklist.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import StepHeader from './StepHeader.svelte';

	const { data } = $props();

	console.log(data);
</script>

<PageContainer>
	<StepHeader meetingID={data.meetingID || ''} currentStep={0} />

	<div class="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
		<div class="pb-4">
			<EventDetails {...data.meeting} />
		</div>
		<div>
			<ContactsChecklist
				title="Add Contacts"
				contacts={[{ id: '1', name: 'John Smith', email: 'jsmith@cf.com' }]}
			/>
		</div>
	</div>
</PageContainer>
