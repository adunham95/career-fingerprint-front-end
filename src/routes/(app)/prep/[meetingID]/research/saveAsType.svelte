<script lang="ts">
	import { upsertPrepAnswer, type NewPrepAnswer } from '$lib/API/Mutations/upsert-prep-answer';
	import { useCreatePrepAnswersMutation } from '$lib/API/prep-answers';
	import TextArea from '$lib/Components/FormElements/TextArea.svelte';
	import { debounce } from '$lib/Utils/debounce';
	import { createMutation, type CreateBaseMutationResult } from '@tanstack/svelte-query';
	import { onDestroy } from 'svelte';

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

	// const saveMutation = createMutation({
	// 	mutationFn: upsertPrepAnswer,
	// 	onSuccess: (data) => {
	// 		isSaved = true;
	// 		isSaving = false;
	// 		setTimeout(() => {
	// 			isSaved = false;
	// 		}, 500);
	// 	},
	// 	onError: () => {
	// 		isSaving = false;
	// 	}
	// });

	// const unsubscribePrepAnswer = saveMutation.subscribe((t) => {
	// 	save = t;
	// });

	// onDestroy(() => {
	// 	unsubscribePrepAnswer();
	// });

	const saveToAPI = debounce(async () => {
		isSaving = true;
		// save.mutate({ answer: value, questionID: id, jobApplicationID });
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
		{#if isSaving}
			<p class="text-xs italic">Saving...</p>
		{/if}
		{#if isSaved}
			<p class="text-xs italic">Saved</p>
		{/if}
	</div>
</div>
