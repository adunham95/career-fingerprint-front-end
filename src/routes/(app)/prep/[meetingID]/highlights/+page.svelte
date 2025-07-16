<script lang="ts">
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import StepList from '$lib/Components/StepList.svelte';
	import { getSteps } from '../steps.js';
	import Card from '$lib/Components/Containers/Card.svelte';
	import CheckCards from '$lib/Components/FormElements/CheckCards.svelte';
	import { onDestroy, onMount } from 'svelte';
	import UpdateJobDescription from '$lib/Components/Forms/UpdateJobDescription.svelte';
	import InfoBlock from '$lib/Components/InfoBlock.svelte';
	import Toggle from '$lib/Components/FormElements/Toggle.svelte';
	import TextArea from '$lib/Components/FormElements/TextArea.svelte';
	import { createMutation, type CreateBaseMutationResult } from '@tanstack/svelte-query';
	import {
		postHighlight,
		type NewHighlight,
		type PostHighlightResponse
	} from '$lib/API/Mutations/post-highlight.js';
	import { toastStore } from '$lib/Components/Toasts/toast.js';

	let text = $state<string | undefined>();
	let showEditJD = $state(false);
	let note = $state<undefined | string>();
	let checkedAchievements = $state([]);

	onMount(() => {
		document.addEventListener('mouseup', () => {
			let selText = window?.getSelection()?.toString();
			if (selText !== '') {
				text = selText;
			}
		});
	});

	let save: CreateBaseMutationResult<PostHighlightResponse | null, Error, NewHighlight, unknown>;

	const saveMutation = createMutation({
		mutationFn: postHighlight,
		onSuccess: (data) => {
			toastStore.show({ message: 'Highlight Saved', type: 'success' });
			note = undefined;
			checkedAchievements = [];
			text = undefined;
		},

		onError: () => {
			toastStore.show({ message: 'There was an error saving your highlight', type: 'error' });
		}
	});

	const unsubscribeJobApplications = saveMutation.subscribe((t) => {
		save = t;
	});

	onDestroy(() => {
		unsubscribeJobApplications();
	});

	const { data } = $props();

	console.log({ data });

	function addHighlight(e: SubmitEvent) {
		e.preventDefault();
		if (save.hasOwnProperty('mutate')) {
			save.mutate({ text: text || '', meetingID: data.meetingID || '', achievements: [], note });
		}
	}
</script>

<!-- Highlights -->

<PageContainer>
	<StepList currentStep={1} steps={getSteps(data.meetingID)} />
	<div class="mt-8 flex justify-between">
		<h1 class="font-title text-2xl">Relevant Achievements</h1>
		<div>
			<a href={`/prep/${data.meetingID}`} class="btn btn-text--primary">Prev Step</a>
			<a href={`/prep/${data.meetingID}/research`} class="btn btn-text--primary">Next Step</a>
		</div>
	</div>
	<div class="grid grid-cols-2 gap-2 pt-2">
		<div>
			<div class="pb-2">
				<Toggle bind:checked={showEditJD} label="Edit Job Description" />
			</div>
			{#if showEditJD}
				<UpdateJobDescription
					jobAppID={data?.meeting?.jobApp?.id}
					jobDescription={data?.meeting?.jobApp?.jobDescription}
				/>
			{:else}
				<Card>
					<p class=" max-h-[300px] overflow-y-auto whitespace-pre-wrap">
						{#if data.meeting?.jobApp?.jobDescription}
							{data.meeting.jobApp.jobDescription}
						{:else}
							<InfoBlock
								title="Job Description"
								description="Add your job description before you can highlight"
							/>
						{/if}
					</p>
				</Card>
			{/if}
		</div>
		<form class="space-y-2" onsubmit={addHighlight}>
			{#if text}
				<div class="flex items-center justify-between">
					<h2 class="font-title">Add Highlight</h2>
					<button type="submit" class="btn btn-text--primary btn-small">Add Highlight</button>
				</div>
				<blockquote class="border-primary bg-secondary-50 border-l-6 p-4">
					<p class="text-sm whitespace-pre-wrap">{text}</p>
				</blockquote>
				<TextArea
					id="add-note"
					bind:value={note}
					label="Add Note To Highlight"
					placeholder="Add Note To Highlight"
					hideLabel
				/>
				<CheckCards
					bind:value={checkedAchievements}
					options={(data.achievements || []).map((a) => {
						return { id: a.id, label: a.myContribution };
					})}
				/>
			{:else}
				<InfoBlock
					title="Get started"
					description="Get started by highlighting part of the job description. Then you can add notes, and link to achievements"
				/>
			{/if}
		</form>
	</div>
</PageContainer>
