<script lang="ts">
	import { useUpdateMeetingMutation } from '$lib/API/meeting';
	import Card from '$lib/Components/Containers/Card.svelte';
	import ButtonList from '$lib/Components/FormElements/ButtonList.svelte';
	import AssignToJob from '$lib/Components/Forms/AssignToJob.svelte';
	import InfoBlock from '$lib/Components/InfoBlock.svelte';

	interface Props {
		meetingID: string;
	}

	const { meetingID }: Props = $props();

	let updateMeetingMutation = useUpdateMeetingMutation(meetingID);

	let meetingType = $state(undefined);
	let meetingConnection = $state({});

	async function updateMeeting() {
		console.log({ meetingType, meetingConnection });
		try {
			await $updateMeetingMutation.mutateAsync({
				id: meetingID,
				type: meetingType,
				...meetingConnection
			});
		} catch (error) {}
	}
</script>

<Card className="mt-4">
	<InfoBlock
		title="No Job Description"
		description="Missing the connection to a job. Select a meeting type, then link to a job, education or job application. "
	/>
	<div class="p-2">
		<fieldset>
			<ButtonList
				id="type"
				bind:value={meetingType}
				options={[
					{ id: 'Interview', label: 'Interview' },
					{ id: 'Internal', label: 'Internal' }
				]}
			/>
		</fieldset>
	</div>
	<AssignToJob type={meetingType} bind:value={meetingConnection} />
	{#snippet actions()}
		<button onclick={updateMeeting} class="btn btn-text--primary">Update</button>
	{/snippet}
</Card>
