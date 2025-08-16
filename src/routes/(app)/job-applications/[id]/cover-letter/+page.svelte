<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import { useUpdateCoverLetterMutation, type NewCoverLetter } from '$lib/API/cover-letters';
	import FeatureBlock from '$lib/Components/FeatureBlock.svelte';
	import InlineTextInput from '$lib/Components/FormElements/InlineTextInput.svelte';
	import TextArea from '$lib/Components/FormElements/TextArea.svelte';
	import InfoBlock from '$lib/Components/InfoBlock.svelte';
	import PremiumBadge from '$lib/Components/PremiumBadge.svelte';
	import { trackingStore } from '$lib/Stores/tracking.js';
	import { debounce } from '$lib/Utils/debounce.js';
	import { useFeatureGate } from '$lib/Utils/featureGate.js';
	import { onMount } from 'svelte';

	const { data } = $props();

	onMount(() => {
		trackingStore.pageViewEvent('Job Application', { tab: 'Cover Letter' });
	});

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

<div class="flex items-center justify-between">
	<h2>Cover Letter</h2>
	{#if useFeatureGate(1, data.user)}
		<a
			href="{PUBLIC_API_URL}/cover-letters/jobApp/{data.application?.id}/pdf"
			target="_blank"
			download
			rel="noopener noreferrer"
			class="btn btn--primary relative ml-4"
		>
			<span>Download Cover Letter</span>
			<PremiumBadge />
		</a>
	{/if}
</div>

{#if !useFeatureGate(1, data.user)}
	<div class="my-2">
		<FeatureBlock
			title="Download Cover Letter"
			description="To download your cover letter, upgrade to the pro plan"
		/>
	</div>
{/if}

<div class="mt-4">
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
