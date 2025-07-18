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
	import {
		createMutation,
		createQuery,
		type CreateBaseMutationResult,
		type QueryObserverResult
	} from '@tanstack/svelte-query';
	import {
		postHighlight,
		type NewHighlight,
		type PostHighlightResponse
	} from '$lib/API/Mutations/post-highlight.js';
	import { toastStore } from '$lib/Components/Toasts/toast.js';
	import MenuButton from '$lib/Components/Buttons/MenuButton.svelte';
	import {
		fetchMeetingHighlights,
		meetingHighlightsQueryKey
	} from '$lib/API/Queries/meeting-highlights.js';
	import type { MeetingHighlight } from '../../../../../app.js';
	import { queryClient } from '$lib/API/queryClient.js';

	let text = $state<string | undefined>();
	let showEditJD = $state(false);
	let note = $state<undefined | string>();
	let checkedAchievements = $state([]);
	const { data } = $props();

	let MeetingHighlightsQuery = createQuery<MeetingHighlight[]>({
		queryKey: [meetingHighlightsQueryKey, data.meetingID],
		queryFn: async () => await fetchMeetingHighlights(data.meetingID || ''),
		initialData: data.highlights
	});

	let highlights = $state<QueryObserverResult<MeetingHighlight[], Error>>();

	const unsubscribeMeetingHighlights = MeetingHighlightsQuery.subscribe((t) => {
		highlights = t;
	});

	onDestroy(() => {
		unsubscribeMeetingHighlights();
	});

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
		onSuccess: (newHighlight) => {
			toastStore.show({ message: 'Highlight Saved', type: 'success' });
			note = undefined;
			checkedAchievements = [];
			text = undefined;
			console.log({ newHighlight });
			queryClient.invalidateQueries({
				queryKey: [meetingHighlightsQueryKey, data.meetingID],
				exact: true,
				refetchType: 'active'
			});
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
	<div class="grid grid-cols-2 gap-4 pt-2">
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

			<ul role="list" class="divide-y divide-gray-100">
				{#each highlights?.data || [] as highlight}
					<li class="flex items-center justify-between gap-x-6 py-5">
						<div class="min-w-0">
							<div class="flex items-start gap-x-3">
								<p class="text-sm/6 font-semibold text-gray-900">"{highlight.text}"</p>
							</div>
							<div class="mt-1 flex items-center gap-x-2 text-xs/5 text-gray-500">
								<p class="whitespace-nowrap">
									Notes: {highlight.notes.length}
								</p>
								<svg viewBox="0 0 2 2" class="size-0.5 fill-current">
									<circle r="1" cx="1" cy="1" />
								</svg>
								<p class="truncate">Achievements: {highlight.achievements.length}</p>
							</div>
						</div>
						<MenuButton
							buttons={[
								{ title: 'Delete', onClick: () => null },
								{ title: 'Edit', onClick: () => null },
								{ title: 'link', href: '/' }
							]}
						/>
					</li>
				{/each}
			</ul>
		</form>
	</div>
</PageContainer>
