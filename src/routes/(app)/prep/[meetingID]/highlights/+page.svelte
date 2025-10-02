<script lang="ts">
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import Card from '$lib/Components/Containers/Card.svelte';
	import CheckCards from '$lib/Components/FormElements/CheckCards.svelte';
	import { onDestroy, onMount } from 'svelte';
	import UpdateJobDescription from '$lib/Components/Forms/UpdateJobDescription.svelte';
	import InfoBlock from '$lib/Components/InfoBlock.svelte';
	import Toggle from '$lib/Components/FormElements/Toggle.svelte';
	import TextArea from '$lib/Components/FormElements/TextArea.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast.js';
	import MenuButton from '$lib/Components/Buttons/MenuButton.svelte';
	import {
		useCreateHighlightMutation,
		useDeleteHighlightMutation,
		useMeetingHighlightsQuery,
		useUpdateHighlightMutation
	} from '$lib/API/highlights.js';
	import { browser } from '$app/environment';
	import UpdateMeetingAgenda from '$lib/Components/Forms/UpdateMeetingAgenda.svelte';
	import { useMeetingByID } from '$lib/API/meeting.js';
	import { trackingStore } from '$lib/Stores/tracking.js';
	import StepHeader from '../StepHeader.svelte';

	const { data } = $props();
	let editID = $state<string | undefined>();
	let noteID = $state<string | undefined>();
	let text = $state<string | undefined>();
	let showEditJD = $state(false);
	let note = $state<undefined | string>();
	let checkedAchievements = $state<string[]>([]);
	let unCheckedAchievements = $state<string[]>([]);

	console.log({ data });

	const meeting = useMeetingByID(data.meeting?.id || '', data.meeting);
	const deleteHighlightMutation = useDeleteHighlightMutation(data.meetingID || '');
	const meetingHighlights = useMeetingHighlightsQuery(data.meetingID || '', data.highlights);
	const saveHighlightMutation = useCreateHighlightMutation(data.meetingID || '');
	const updateHighlightMutation = useUpdateHighlightMutation(data.meetingID || '');

	let meetingText = $state($meeting.data?.agenda || $meeting.data?.jobApp?.jobDescription || '');

	function handleMouseUp(event: MouseEvent): void {
		const target = event.target as HTMLElement | null;
		const noteElement = document.getElementById('job-description-area');

		if (noteElement && target && noteElement.contains(target)) {
			const selection = window.getSelection();
			const selText = selection ? selection.toString() : '';
			if (selText !== '') {
				text = selText;
			}
		}
	}

	onMount(() => {
		if (browser) {
			document.addEventListener('mouseup', handleMouseUp);
		}
		trackingStore.pageViewEvent('Meeting Prep - Highlights', {
			type: $meeting.data?.type || ''
		});
	});

	onDestroy(() => {
		if (browser) {
			document.removeEventListener('mouseup', handleMouseUp);
		}
	});

	async function addHighlight(e: SubmitEvent) {
		e.preventDefault();
		try {
			if (editID) {
				await $updateHighlightMutation.mutateAsync({
					id: editID,
					highlight: {
						text: text || '',
						achievementIDs: [...checkedAchievements],
						uncheckAchievementIDs: [...unCheckedAchievements],
						note,
						noteID
					}
				});
			} else {
				await $saveHighlightMutation.mutateAsync({
					text: text || '',
					meetingID: data.meetingID || '',
					achievementIDs: [...checkedAchievements],
					note
				});
			}
			toastStore.show({ message: 'Highlight Saved', type: 'success' });
			editID = undefined;
			note = undefined;
			checkedAchievements = [];
			unCheckedAchievements = [];
			text = undefined;
		} catch (error) {
			toastStore.show({ message: 'There was an error saving your highlight', type: 'error' });
		}
	}

	async function deleteHighlight(id: string) {
		try {
			await $deleteHighlightMutation.mutateAsync(id);
			toastStore.show({ message: 'Deleted successfully', type: 'success' });
		} catch (error) {
			toastStore.show({ message: 'Error deleting highlight', type: 'error' });
		}
	}
</script>

<!-- Highlights -->

<PageContainer>
	<StepHeader meetingID={data.meetingID || ''} currentStep={1} />
	<div class="grid grid-cols-2 gap-4 pt-2">
		<div>
			{#if $meeting.data?.type === 'Interview'}
				<div class="pb-2">
					<Toggle bind:checked={showEditJD} label="Edit Job Description" />
				</div>
				{#if showEditJD}
					<UpdateJobDescription
						jobAppID={$meeting.data?.jobApp?.id}
						bind:jobDescription={meetingText}
						onSuccess={() => {
							showEditJD = false;
						}}
					/>
				{:else}
					<Card>
						<div class=" max-h-[300px] overflow-y-auto whitespace-pre-wrap">
							{#if meetingText !== ''}
								<p id="job-description-area">
									{meetingText}
								</p>
							{:else}
								<InfoBlock
									title="Job Description"
									description="Add your job description before you can highlight"
								/>
							{/if}
						</div>
					</Card>
				{/if}
			{:else if $meeting.data?.type === 'Internal'}
				<div class="pb-2">
					<Toggle bind:checked={showEditJD} label="Edit Meeting Agenda" />
				</div>
				{#if showEditJD}
					<UpdateMeetingAgenda
						meetingID={data.meetingID || ''}
						bind:agenda={meetingText}
						onSuccess={() => (showEditJD = false)}
					/>
				{:else}
					<Card>
						<div class=" max-h-[300px] overflow-y-auto whitespace-pre-wrap">
							{#if meetingText !== ''}
								<p id="job-description-area">
									{meetingText}
								</p>
							{:else}
								<InfoBlock title="Meeting Agenda" description="Add your meeting agenda" />
							{/if}
						</div>
					</Card>
				{/if}
			{/if}
		</div>
		<form class="space-y-2" onsubmit={addHighlight}>
			{#if text}
				<div class="flex items-center justify-between">
					{#if editID}
						<h2 class="font-title">Update Highlight</h2>
						<button type="submit" class="btn btn-text--primary btn-small">Update Highlight</button>
					{:else}
						<h2 class="font-title">Add Highlight</h2>
						<button type="submit" class="btn btn-text--primary btn-small">Add Highlight</button>
					{/if}
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
					bind:unChecked={unCheckedAchievements}
					bind:checked={checkedAchievements}
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
				{#each $meetingHighlights.data || [] as highlight}
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
								{ title: 'Delete', onClick: () => deleteHighlight(highlight.id) },
								{
									title: 'Edit',
									onClick: () => {
										editID = highlight.id;
										text = highlight.text;
										note = highlight.notes?.[0]?.note || undefined;
										noteID = highlight.notes?.[0]?.id || undefined;
										checkedAchievements = highlight?.achievements.map((a) => a.id);
									}
								}
							]}
						/>
					</li>
				{/each}
			</ul>
		</form>
	</div>
</PageContainer>
