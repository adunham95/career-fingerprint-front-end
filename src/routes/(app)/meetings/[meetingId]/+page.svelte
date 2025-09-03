<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { useCreateNote, useMeetingNotes } from '$lib/API/notes.js';
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import Label from '$lib/Components/FormElements/Label.svelte';
	import TextArea from '$lib/Components/FormElements/TextArea.svelte';
	import NavPillButtons from '$lib/Components/Header/NavPillButtons.svelte';
	import StatusBadge from '$lib/Components/StatusBadge.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast';
	import { trackingStore } from '$lib/Stores/tracking.js';
	import { useFeatureGate } from '$lib/Utils/featureGate.js';
	import { format, isFuture } from 'date-fns';
	import { onMount } from 'svelte';

	const { data } = $props();
	let current = $state('notes');
	let newNote = $state('');

	let meetingNotes = useMeetingNotes(data.meetingID || '', data.relatedNotes);
	let createMeetingNotes = useCreateNote(data.meetingID || '');

	console.log({ data });

	onMount(() => {
		trackingStore.pageViewEvent('Meeting Details');
	});

	async function saveNote() {
		try {
			await $createMeetingNotes.mutateAsync({ note: newNote, meetingID: data.meetingID || '' });
			toastStore.show({ message: 'Note Save', type: 'success' });
			newNote = '';
		} catch (error) {
			toastStore.show({ message: 'Could not save note', type: 'error' });
		}
	}
</script>

<div>
	<div>
		<img
			src="/images/pexels-esteban-carriazo-2153373740-33008788.jpg"
			alt=""
			class="h-32 w-full object-cover lg:h-48"
		/>
	</div>
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="sm:flex sm:items-end sm:space-x-5">
			<div
				class="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1"
			>
				<div class="mt-6 min-w-0 flex-1 sm:hidden md:block">
					<h1 class="truncate text-2xl font-bold text-gray-900">{data.meeting.title}</h1>
				</div>
				<div
					class="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4"
				>
					{#if isFuture(data.meeting.time) && useFeatureGate(1, data.user)}
						<a
							href={`/prep/${data.meetingID}`}
							type="button"
							class="btn btn-text--secondary"
							onclick={() =>
								trackingStore.trackAction('Prep Meeting', { component: 'Meeting Details Page' })}
							>Prep for Meeting
						</a>
						<a
							href={`/cheatsheet/${data.meetingID}`}
							type="button"
							class="btn btn--primary"
							onclick={() => {
								trackingStore.trackAction('Start Meeting', { component: 'Meeting Details Page' });
							}}
						>
							Start Meeting
						</a>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<PageContainer className="pt-4">
	<div class="grid gap-4 lg:grid-cols-3">
		<div
			class=" px-4 py-8 shadow-xs ring-3 ring-gray-900/5 sm:mx-0 sm:rounded-lg sm:px-8 sm:pb-14 lg:col-span-2 lg:row-span-2 lg:row-end-2"
		>
			<NavPillButtons
				bind:currentTab={current}
				tabs={[
					{ id: 'notes', label: 'Notes' },
					{ id: 'highlights', label: 'Highlights' }
				]}
			/>
			<div class="px-1 py-1">
				{#if current === 'notes'}
					<div class="pb-2">
						<Label label="Take Notes" />
						<TextArea
							id="note"
							label="Note"
							hideLabel
							placeholder="Note"
							rows={4}
							bind:value={newNote}
						/>
						<div class="flex justify-end">
							<button
								class="btn btn-text--primary"
								onclick={() => {
									saveNote();
									trackingStore.trackAction('Add  Note Click');
								}}>Add Note</button
							>
						</div>
					</div>
					<ul class="space-y-2">
						{#each $meetingNotes.data as note}
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
		<div class="space-y-4">
			<Card>
				<div class="space-y-6">
					<!-- Meeting Type -->
					<div class="flex w-full flex-none gap-x-4">
						<dt class="flex-none">
							<span class="sr-only">Meeting Type</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								class="size-6"
							>
								<path
									fill-rule="evenodd"
									d="M2.25 2.25a.75.75 0 0 0 0 1.5H3v10.5a3 3 0 0 0 3 3h1.21l-1.172 3.513a.75.75 0 0 0 1.424.474l.329-.987h8.418l.33.987a.75.75 0 0 0 1.422-.474l-1.17-3.513H18a3 3 0 0 0 3-3V3.75h.75a.75.75 0 0 0 0-1.5H2.25Zm6.04 16.5.5-1.5h6.42l.5 1.5H8.29Zm7.46-12a.75.75 0 0 0-1.5 0v6a.75.75 0 0 0 1.5 0v-6Zm-3 2.25a.75.75 0 0 0-1.5 0v3.75a.75.75 0 0 0 1.5 0V9Zm-3 2.25a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 1.5 0v-1.5Z"
									clip-rule="evenodd"
								/>
							</svg>
						</dt>
						<dd class="text-sm/6 text-gray-500">
							<p>{data.meeting.type}</p>
						</dd>
					</div>

					<!-- Meeting Time -->
					<div class="flex w-full flex-none gap-x-4">
						<dt class="flex-none">
							<span class="sr-only">Meeting Time</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								class="size-6"
							>
								<path
									fill-rule="evenodd"
									d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
									clip-rule="evenodd"
								/>
							</svg>
						</dt>
						<dd class="text-sm/6 text-gray-500">
							<time>{format(data.meeting.time, 'Pp')}</time>
						</dd>
					</div>

					{#if data.meeting.location}
						<!-- Meeting Time -->
						<div class="flex w-full flex-none gap-x-4">
							<dt class="flex-none">
								<span class="sr-only">Meeting Time</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									class="size-6"
								>
									<path
										fill-rule="evenodd"
										d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
										clip-rule="evenodd"
									/>
								</svg>
							</dt>
							<dd class="text-sm/6 text-gray-500">
								<p>{data.meeting.location}</p>
							</dd>
						</div>
					{/if}

					{#if data.meeting.link}
						<!-- Meeting Time -->
						<div class="flex w-full flex-none gap-x-4">
							<dt class="flex-none">
								<span class="sr-only">Meeting Time</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									class="size-6"
								>
									<path
										fill-rule="evenodd"
										d="M19.902 4.098a3.75 3.75 0 0 0-5.304 0l-4.5 4.5a3.75 3.75 0 0 0 1.035 6.037.75.75 0 0 1-.646 1.353 5.25 5.25 0 0 1-1.449-8.45l4.5-4.5a5.25 5.25 0 1 1 7.424 7.424l-1.757 1.757a.75.75 0 1 1-1.06-1.06l1.757-1.757a3.75 3.75 0 0 0 0-5.304Zm-7.389 4.267a.75.75 0 0 1 1-.353 5.25 5.25 0 0 1 1.449 8.45l-4.5 4.5a5.25 5.25 0 1 1-7.424-7.424l1.757-1.757a.75.75 0 1 1 1.06 1.06l-1.757 1.757a3.75 3.75 0 1 0 5.304 5.304l4.5-4.5a3.75 3.75 0 0 0-1.035-6.037.75.75 0 0 1-.354-1Z"
										clip-rule="evenodd"
									/>
								</svg>
							</dt>
							<dd class="text-sm/6">
								<a
									href={data.meeting.link}
									onclick={() => trackingStore.trackAction('Meeting Link Click')}
									target="_blank"
									class="text-primary hover:text-primary-700">Meeting Link</a
								>
							</dd>
						</div>
					{/if}
				</div>
			</Card>
			{#if data.meeting.jobApp}
				{@const jobApp = data.meeting.jobApp}
				<Card>
					<dl class="flex flex-wrap">
						<div class="mr-2 size-14 shrink-0 overflow-hidden rounded p-1">
							<img
								src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${jobApp.companyURL}&size=128`}
								alt="Company Logo"
								class="size-full object-cover"
							/>
						</div>
						<div class="flex-auto">
							<dt class="text-sm/6 font-semibold text-gray-900">{jobApp.title}</dt>
							<dd class="mt-1 text-base font-semibold text-gray-700">{jobApp.company}</dd>
						</div>
						<div class="flex-none self-end">
							<dt class="sr-only">Status</dt>
							<StatusBadge status={jobApp.status} />
						</div>
					</dl>
				</Card>
			{/if}
		</div>
	</div>
</PageContainer>
