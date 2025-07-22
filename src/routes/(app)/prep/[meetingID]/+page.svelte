<script lang="ts">
	import { useMeetingByID } from '$lib/API/meeting';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import MeetingForm from '$lib/Components/Forms/MeetingForm.svelte';
	import StepHeader from './StepHeader.svelte';

	const { data } = $props();

	const meeting = useMeetingByID(data.meeting.id, data.meeting);

	console.log(data);
</script>

<PageContainer>
	<StepHeader meetingID={data.meetingID || ''} currentStep={0} />

	<div class="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
		<div class="pb-4">
			<MeetingForm
				id="update-meeting"
				meetingID={data.meetingID}
				meeting={$meeting.data || {}}
				updateOnChange
			/>
		</div>
	</div>
</PageContainer>
