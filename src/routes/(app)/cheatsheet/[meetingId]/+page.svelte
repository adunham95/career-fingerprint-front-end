<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import Label from '$lib/Components/FormElements/Label.svelte';
	import TextArea from '$lib/Components/FormElements/TextArea.svelte';
	import NewMeetingForm from '$lib/Components/Forms/MeetingForm.svelte';
	import NavPillButtons from '$lib/Components/Header/NavPillButtons.svelte';
	import Drawer from '$lib/Components/Overlays/Drawer.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast';
	import { formatDate } from '$lib/Utils/formatDate';

	const { data } = $props();

	console.log({ data });
	let currentNote = $state('');
	let showMeetingDetails = $state(false);

	async function saveNote() {
		const url = `${PUBLIC_API_URL}/notes`;

		const res = await fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json' // Set content type to JSON
			},
			body: JSON.stringify({
				note: currentNote,
				meetingID: data.meetingID
			})
		});

		if (res.ok) {
			toastStore.show({ message: 'Note Save', type: 'success' });
			currentNote = '';
		}
	}

	function finishMeeting() {
		showMeetingDetails = true;
		saveNote();
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
					<button type="button" class="btn btn--primary" onclick={finishMeeting}
						>Finish Meeting</button
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
				<button class="btn btn-text--primary" onclick={saveNote}>Add Note</button>
			</div>
		</div>
		<div class="  row-span-2">
			<NavPillButtons
				bind:currentTab={current}
				tabs={[
					{ id: 'details', label: 'Job Details' },
					{ id: 'resume', label: 'Resume' },
					{ id: 'notes', label: 'Prior Notes' },
					{ id: 'highlights', label: 'Highlights' }
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
									<ul class="list-disk list-inside">
										{#each job.achievements as ach}
											<li class="ml-5">{ach.myContribution}</li>
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
									<ol class="list-disk list-inside">
										{#each edu.achievements as ach}
											<li>{ach.myContribution}</li>
										{/each}
									</ol>
								{/if}
							</Card>
						{/each}
					</ul>
				{:else if current === 'details'}
					<p class="whitespace-pre-wrap">
						{data.interviewData?.jobApp?.jobDescription}
					</p>
				{:else if current === 'notes'}
					<ul class="space-y-2">
						{#each data.relatedNotes as note}
							<li>
								<Card size="sm">
									<p>{note.note}</p>
								</Card>
							</li>
						{/each}
					</ul>
				{:else if current === 'highlights'}
					<ul class="space-y-2">
						{#each data.highlights as highlight}
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
	<NewMeetingForm
		id="updateMeeting"
		meetingID={data.meetingID}
		onSuccess={() => goto('/dashboard')}
	/>
</Drawer>
