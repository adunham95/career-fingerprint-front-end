<script lang="ts">
	import { useCreatePrepAnswersMutation } from '$lib/API/prep-answers';
	import TextArea from '$lib/Components/FormElements/TextArea.svelte';
	import { trackingStore } from '$lib/Stores/tracking';
	import { debounce } from '$lib/Utils/debounce';

	let isSaving = $state(false);
	let isSaved = $state(false);

	interface Props {
		jobApplicationID: string;
		id: string;
		label: string;
		value: string;
		meetingID: string;
	}

	let { id, label, value = $bindable(), jobApplicationID, meetingID }: Props = $props();

	const updateAnswer = useCreatePrepAnswersMutation();

	const saveToAPI = debounce(async () => {
		trackingStore.pageViewEvent('Update Prep Answer', { questionID: id });
		isSaving = true;

		await $updateAnswer.mutateAsync({
			answer: value,
			questionID: id,
			jobApplicationID,
			meetingID
		});
	}, 500);
</script>

<div>
	<TextArea bind:value {id} {label} oninput={(e) => saveToAPI()} />
	<div class="flex min-h-[1rem] w-full justify-end">
		{#if $updateAnswer.isPending}
			<p class="text-xs italic">Saving...</p>
		{/if}
		{#if $updateAnswer.isSuccess}
			<p class="text-xs italic">Saved</p>
		{/if}
	</div>
</div>
