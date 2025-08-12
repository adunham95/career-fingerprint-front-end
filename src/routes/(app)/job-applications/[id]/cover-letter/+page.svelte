<script lang="ts">
	import { useUpdateCoverLetterMutation, type NewCoverLetter } from '$lib/API/cover-letters';
	import InlineTextInput from '$lib/Components/FormElements/InlineTextInput.svelte';
	import TextArea from '$lib/Components/FormElements/TextArea.svelte';
	import { debounce } from '$lib/Utils/debounce.js';

	const { data } = $props();

	let isSaving = $state<string | null>(null);

	let coverLetter = $state(data.coverLetter?.message || '');
	let coverTo = $state(data.coverLetter?.to || '');

	console.log({ data });

	const updateCoverLetter = useUpdateCoverLetterMutation(data.application?.id || '');

	const saveToAPI = debounce(async (type: 'to' | 'message') => {
		isSaving = type;
		console.log({ type });

		await $updateCoverLetter.mutateAsync({
			jobAppID: data.application?.id || '',
			to: coverTo,
			message: coverLetter
		});

		isSaving = null;
	}, 500);
</script>

<div>
	<p>{data.user.firstName} {data.user.lastName}</p>
	<br />
	<p>{data.application?.company}</p>
	<br />
	<div>
		Hello <InlineTextInput
			id="hiring manager name"
			label="To name"
			bind:value={coverTo}
			onInput={() => saveToAPI('to')}
			placeholder="Hiring Manger"
		/>
	</div>
	{#if isSaving === 'to'}
		<p class="text-xs italic">Saving...</p>
	{/if}
	<br />
</div>

<TextArea
	id="coverletter"
	bind:value={coverLetter}
	oninput={() => saveToAPI('message')}
	rows={10}
	placeholder="I am writing to express my interest in the [Position Title] role at [Company Name] "
/>

{#if isSaving === 'message'}
	<p class="text-xs italic">Saving...</p>
{/if}
