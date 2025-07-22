<script lang="ts">
	import TextArea from '../FormElements/TextArea.svelte';
	import { useUpdateMeetingMutation } from '$lib/API/meeting';

	interface Props {
		meetingID: string;
		agenda?: string | null;
		onSuccess?: () => void;
	}

	let { meetingID, agenda = $bindable(), onSuccess = () => null }: Props = $props();

	const updateMeeting = useUpdateMeetingMutation(meetingID);

	function updateMeetingAgenda(e: SubmitEvent) {
		e.preventDefault();
		if (typeof agenda !== 'string') {
			return;
		}
		$updateMeeting.mutateAsync({ id: meetingID, agenda });
		onSuccess();
	}
</script>

<form onsubmit={(e) => updateMeetingAgenda(e)}>
	<TextArea id="meeting-agenda" label="Meeting Agenda" rows={6} bind:value={agenda} />
	<div class="flex justify-end pt-4">
		<button type="submit" class="btn btn--primary">Updated Meeting Agenda</button>
	</div>
</form>
