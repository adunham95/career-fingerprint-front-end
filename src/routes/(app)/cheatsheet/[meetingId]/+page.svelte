<script lang="ts">
	import { goto } from '$app/navigation';
	import { useMeetingByID } from '$lib/API/meeting.js';
	import { useCreateNote, useMeetingNotes } from '$lib/API/notes.js';
	import { useAddThankYouMutation } from '$lib/API/thankYouNotes.js';
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import ErrorText from '$lib/Components/FormElements/ErrorText.svelte';
	import Label from '$lib/Components/FormElements/Label.svelte';
	import TextArea from '$lib/Components/FormElements/TextArea.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
	import NewMeetingForm from '$lib/Components/Forms/MeetingForm.svelte';
	import NavPillButtons from '$lib/Components/Header/NavPillButtons.svelte';
	import InfoBlock from '$lib/Components/InfoBlock.svelte';
	import Loader from '$lib/Components/Loader.svelte';
	import Drawer from '$lib/Components/Overlays/Drawer.svelte';
	import Modal from '$lib/Components/Overlays/Modal.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast';
	import { trackingStore } from '$lib/Stores/tracking.js';
	import { formatDate } from '$lib/Utils/formatDate';
	import { onMount } from 'svelte';

	const { data } = $props();
	let meetingNotes = useMeetingNotes(data.meetingID || '', data.relatedNotes);
	let createMeetingNotes = useCreateNote(data.meetingID || '');
	let meetingDetails = useMeetingByID(data.meetingID || '');
	let thankYouNotesMutation = useAddThankYouMutation();

	console.log({ data, meetingDetails });
	let currentNote = $state('');
	let showMeetingDetails = $state(false);
	let showThankYouNote = $state(false);

	let thankYouMessage = $state('');
	let contacts = $state<{ firstName: string; email: string }[]>([]);
	let thankYouErrors = $state<{ [key: string]: string }>({});

	onMount(() => {
		trackingStore.pageViewEvent('Cheatsheet', { type: data?.interviewData?.type || ' ' });
	});

	async function saveNote() {
		if (currentNote === '') {
			return;
		}
		try {
			await $createMeetingNotes.mutateAsync({ note: currentNote, meetingID: data.meetingID || '' });
			toastStore.show({ message: 'Note Save', type: 'success' });
			currentNote = '';
		} catch (error) {
			toastStore.show({ message: 'Could not save note', type: 'error' });
		}
	}

	function finishMeeting() {
		trackingStore.trackAction('Finish Meeting Click');
		showMeetingDetails = true;
		saveNote();
	}

	function removeContact(idx: number) {
		console.log(idx);
		contacts = contacts.filter((_, i) => i !== idx);
	}

	function sendThankYouNote() {
		thankYouErrors = {};
		try {
			if (contacts.length <= 0) {
				thankYouErrors['contacts'] = 'No Contacts';
				return;
			}
			if (thankYouMessage === '') {
				thankYouErrors['message'] = 'Missing Thank You Message';
				return;
			}
			$thankYouNotesMutation.mutateAsync({
				message: thankYouMessage,
				contacts,
				meetingID: data.meetingID || ''
			});
			showThankYouNote = false;
			toastStore.show({ message: 'Sent Thank Notes', type: 'success' });
		} catch (error) {
			toastStore.show({ message: 'Could not send thank you note', type: 'error' });
		}
	}

	let current = $state('resume');
</script>

<PageContainer className="py-2">
	<div class="grid grid-cols-1 gap-2 md:grid-cols-2 md:grid-rows-2">
		<div class="flex flex-col gap-2">
			<div class="pt-2 md:flex md:items-center md:justify-between">
				<div class="min-w-0 flex-1">
					<h2 class="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
						Meeting Cheat Sheet
					</h2>
				</div>
				<div class="mt-4 flex md:mt-0 md:ml-4">
					<button
						type="button"
						class="btn btn--primary"
						onclick={() => {
							finishMeeting();
							trackingStore.trackAction('Finish Meeting Click');
						}}>Finish Meeting</button
					>
				</div>
			</div>
			<Label label="Take Notes" />
			<TextArea
				id="note"
				label="Note"
				hideLabel
				placeholder="Note"
				rows={4}
				bind:value={currentNote}
			/>
			<div class="flex justify-end">
				<button
					class="btn btn-text--primary"
					onclick={() => {
						saveNote();
						trackingStore.trackAction('Add Note Click');
					}}>Add Note</button
				>
			</div>
		</div>
		<div class="  row-span-2">
			<NavPillButtons
				bind:currentTab={current}
				tabs={[
					{ id: 'details', label: 'Job Details' },
					{ id: 'resume', label: 'My Fingerprint' },
					{ id: 'notes', label: 'Notes' },
					{ id: 'highlights', label: 'Highlights' },
					{ id: 'questions', label: 'Questions' }
				]}
			/>
			<div class="overflow-y-auto px-1 py-1 md:max-h-[600px]">
				{#if current === 'resume'}
					<ul class="space-y-2">
						{#each data.jobs || [] as job}
							<Card size="sm" headline={`${job.name} | ${job.company}`}>
								<h5>
									{formatDate(job.startDate)} - {job.currentPosition
										? 'Current'
										: formatDate(job.endDate)}
								</h5>
								<p class="mb-2 border-b border-gray-300 pb-2">{job.description}</p>
								{#if job?.achievements?.length > 0}
									<Label id="" label="My Achievements" />
									<ul class="list-disk list-inside space-y-1 divide-y divide-gray-200">
										{#each job.achievements as ach}
											<li class="ml-5">
												<div>
													{#if ach.description}
														<p>
															Background: {ach.description}
														</p>
													{/if}
													{#if ach.myContribution}
														<p>
															My Contribution: {ach.myContribution}
														</p>
													{/if}
													{#if ach.result}
														<p>
															Result: {ach.result}
														</p>
													{/if}
												</div>
											</li>
										{/each}
									</ul>
								{/if}
							</Card>
						{/each}
						{#each data.education || [] as edu}
							<Card size="sm" headline={`${edu.degree} | ${edu.institution}`}>
								<h5>
									{formatDate(edu.startDate)} - {edu.currentPosition
										? 'Current'
										: formatDate(edu.endDate)}
								</h5>
								<p>{edu.description}</p>
								{#if edu?.achievements?.length > 0}
									<Label id="" label="My Achievements" />
									<ul class="list-disk list-inside space-y-1 divide-y divide-gray-200">
										{#each edu.achievements as ach}
											<li class="ml-5">
												<div>
													{#if ach.description}
														<p>
															Background: {ach.description}
														</p>
													{/if}
													{#if ach.myContribution}
														<p>
															My Contribution: {ach.myContribution}
														</p>
													{/if}
													{#if ach.result}
														<p>
															Result: {ach.result}
														</p>
													{/if}
												</div>
											</li>
										{/each}
									</ul>
								{/if}
							</Card>
						{/each}
					</ul>
				{:else if current === 'details'}
					{#if !data.interviewData?.jobApp?.jobDescription}
						<InfoBlock title="No Job Description" description="Missing Job Description" />
					{/if}
					<p class="whitespace-pre-wrap">
						{data.interviewData?.jobApp?.jobDescription}
					</p>
				{:else if current === 'notes'}
					<ul class="space-y-2">
						{#if $meetingNotes.data.length === 0}
							<InfoBlock
								title="No Notes"
								description="Your notes from other related interviews or meetings will show up here"
							/>
						{/if}
						{#each $meetingNotes.data as note}
							<li>
								<Card size="sm">
									<p>{note.note}</p>
								</Card>
							</li>
						{/each}
					</ul>
				{:else if current === 'questions'}
					<ul class="space-y-2">
						{#if (data.questions || []).length === 0}
							<InfoBlock
								title="No Prep Questions"
								description="Your prepare questions will show up here"
							/>
						{/if}

						{#each data.questions || [] as answer}
							<li>
								<Card size="sm" headline={answer.question.question}>
									<p>{answer.answer}</p>
								</Card>
							</li>
						{/each}
					</ul>
				{:else if current === 'highlights'}
					<ul class="space-y-2">
						{#if data?.highlights && data?.highlights.length === 0}
							<InfoBlock
								title="No Highlights"
								description="Your highlights from previous meetings or prep will show up here."
							/>
						{/if}
						{#each data.highlights || [] as highlight}
							<li>
								<Card size="sm" contentClassName="divide-y divide-gray-200">
									<div class="pb-2">
										<div class="bg-secondary-50 text-secondary-600 rounded-md p-2">
											<blockquote>"{highlight.text}"</blockquote>
										</div>
									</div>
									{#if highlight.notes.length > 0}
										<div class="mt-2">
											<Label id="" label="Notes" />
											<ul>
												{#each highlight.notes as note}
													<li>
														{note.note}
													</li>
												{/each}
											</ul>
										</div>
									{/if}
									{#if highlight.achievements.length > 0}
										<div class="mt-2">
											<Label id="" label="Related Achievements" />
											<ol class="ml-5 list-disc">
												{#each highlight.achievements as ach}
													<li>
														{ach.myContribution}
													</li>
												{/each}
											</ol>
										</div>
									{/if}
								</Card>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		</div>
	</div>
</PageContainer>

<Drawer
	bind:isOpen={showMeetingDetails}
	title="Update Your Meeting"
	subTitle="Update your meeting so you can find it later"
	saveFormID="updateMeeting"
>
	{#if $meetingDetails}
		<NewMeetingForm
			id="updateMeeting"
			meetingID={data.meetingID}
			meeting={$meetingDetails.data}
			onSuccess={() => {
				showThankYouNote = true;
				showMeetingDetails = false;
			}}
		/>
	{:else}
		<Loader />
	{/if}
</Drawer>

<Modal title="Add Thank You Note" size="lg" bind:isOpen={showThankYouNote}>
	<div class="grid grid-cols-2 gap-x-2">
		<TextArea
			id="thank-you-note"
			label="Thank You Note"
			rows={5}
			bind:value={thankYouMessage}
			placeholder="Thank you for the interview today. I appreciated the chance to hear more about the position and how the team works. Please let me know if you need anything else from me as you move forward."
			errorText={thankYouErrors.message}
		/>
		<div>
			<Label id="idx" label="Add Contacts" />
			{#if thankYouErrors.contacts}
				<ErrorText errorText={thankYouErrors.contacts} />
			{/if}
			<div class=" max-h-32 space-y-2 overflow-y-auto">
				{#each contacts as contact, idx}
					<div class="flex gap-x-1">
						<TextInput id="firstName" placeholder="First Name" bind:value={contact.firstName} />
						<TextInput id="email" placeholder="Email" bind:value={contact.email} />
						<button class="btn btn-text--error btn-small" onclick={() => removeContact(idx)}>
							<span class="sr-only"> Delete </span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-4"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
								/>
							</svg>
						</button>
					</div>
				{/each}
				<button
					type="button"
					class="w-full rounded-md border border-gray-400 p-2 text-center text-sm hover:bg-gray-400"
					onclick={() => contacts.push({ firstName: '', email: '' })}
				>
					Add Contact
				</button>
			</div>
		</div>
	</div>
	{#snippet actions()}
		<button class="btn btn-text--secondary">Do Not Send Thank You Note</button>
		<button class="btn btn--primary" onclick={sendThankYouNote}>Send Note</button>
	{/snippet}
</Modal>
