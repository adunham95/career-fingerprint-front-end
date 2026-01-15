<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { useDeleteMeetingMutation, useMeetingByID } from '$lib/API/meeting.js';
	import { useCreateNote, useMeetingNotes } from '$lib/API/notes.js';
	import { useGetThankYouNotesForMeeting } from '$lib/API/thankYouNotes.js';
	import MenuButton from '$lib/Components/Buttons/MenuButton.svelte';
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import FeatureBlock from '$lib/Components/FeatureBlock.svelte';
	import Label from '$lib/Components/FormElements/Label.svelte';
	import TextArea from '$lib/Components/FormElements/TextArea.svelte';
	import MeetingForm from '$lib/Components/Forms/MeetingForm.svelte';
	import NewThankYouNote from '$lib/Components/Forms/NewThankYouNote.svelte';
	import NavPillButtons from '$lib/Components/Header/NavPillButtons.svelte';
	import InfoBlock from '$lib/Components/InfoBlock.svelte';
	import Drawer from '$lib/Components/Overlays/Drawer.svelte';
	import PremiumBadge from '$lib/Components/PremiumBadge.svelte';
	import StatusBadge from '$lib/Components/StatusBadge.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast';
	import { trackingStore } from '$lib/Stores/tracking.js';
	import { useFeatureGate } from '$lib/Utils/featureGate.js';
	import { format } from 'date-fns';
	import { onMount } from 'svelte';

	const { data } = $props();
	let current = $state('notes');
	let newNote = $state('');
	let showMeetingDetails = $state(false);

	let myMeeting = useMeetingByID(data.meetingID || '', data.meeting);
	let meetingNotes = useMeetingNotes(data.meetingID || '', data.relatedNotes);
	let createMeetingNotes = useCreateNote(data.meetingID || '');
	let deleteMeetingMutation = useDeleteMeetingMutation(data.meetingID || '');

	let thankYouNotes = useGetThankYouNotesForMeeting(data.meetingID || '');

	$effect(() => {
		if (current === 'thankYouNotes') {
			$thankYouNotes.refetch();
		}
	});

	function isUpcomingOrRecent(meetingTime: Date | string): boolean {
		const tenMinutesAgo = Date.now() - 10 * 60 * 1000; // timestamp
		const meetingTimestamp =
			meetingTime instanceof Date ? meetingTime.getTime() : new Date(meetingTime).getTime();

		return meetingTimestamp >= tenMinutesAgo;
	}
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

	async function deleteMeeting() {
		try {
			await $deleteMeetingMutation.mutateAsync(data.meetingID || '');
			toastStore.show({ message: 'Meeting Deleted', type: 'success' });
			goto('/meetings');
		} catch (error) {
			toastStore.show({ message: 'Could delete meeting', type: 'error' });
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
					<h1 class="truncate text-2xl font-bold text-gray-900">
						{$myMeeting.data?.title || 'Meeting'}
					</h1>
				</div>
				<div
					class="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4"
				>
					{#if useFeatureGate(2, data.user)}
						<a
							href={`${PUBLIC_API_URL}/notes/meeting/${data.meetingID}/pdf`}
							type="button"
							download
							class="btn btn--secondary relative"
							onclick={() => {
								trackingStore.trackAction('Start Meeting', { component: 'Meeting Details Page' });
							}}
						>
							<PremiumBadge />
							Download Meeting Notes
						</a>
					{:else}
						<div class="btn btn--secondary relative cursor-not-allowed opacity-25">
							<PremiumBadge />
							Download Meeting Notes
						</div>
					{/if}
					{#if isUpcomingOrRecent($myMeeting.data?.time || new Date())}
						{#if useFeatureGate(2, data.user)}
							<a
								href={`/prep/${data.meetingID}`}
								type="button"
								class="btn btn-text--secondary relative"
								onclick={() =>
									trackingStore.trackAction('Prep Meeting', { component: 'Meeting Details Page' })}
								><PremiumBadge />
								Prep for Meeting
							</a>
							<a
								href={`/cheatsheet/${data.meetingID}`}
								type="button"
								class="btn btn--primary relative"
								onclick={() => {
									trackingStore.trackAction('Start Meeting', { component: 'Meeting Details Page' });
								}}
							>
								<PremiumBadge />
								Start Meeting
							</a>
						{:else}
							<div class="btn btn--secondary relative cursor-not-allowed opacity-25">
								<PremiumBadge />
								Prep for Meeting
							</div>
							<div class="btn btn--primary relative cursor-not-allowed opacity-25">
								<PremiumBadge />
								Start Meeting
							</div>
						{/if}
					{/if}
					<MenuButton
						size="size-8"
						buttons={[
							{ title: 'Delete Meeting', onClick: () => deleteMeeting() },
							{
								title: 'EditMeeting',
								onClick: () => {
									showMeetingDetails = true;
								}
							}
						]}
					/>
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
					{ id: 'highlights', label: 'Highlights' },
					{ id: 'thankYouNotes', label: 'Thank You Notes' }
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
						{#if (data.highlights || []).length === 0}
							{#if useFeatureGate(2, data.user)}
								<InfoBlock
									title="Empty Highlights"
									description="The highlight list is empty. Prepare for a meeting to add new highlights"
								/>
							{:else}
								<FeatureBlock
									title="Meeting Highlights"
									description="Meeting highlights show when you prep for a meeting"
								/>
							{/if}
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
				{:else if current === 'thankYouNotes'}
					<div>
						<NewThankYouNote meetingID={data.meetingID || ''} formID="newThankYouNote" />
						<div class="flex justify-end">
							<button class="btn btn--primary" form="newThankYouNote">Send Note</button>
						</div>
						<ul>
							{#each $thankYouNotes.data as thankYou}
								<li>
									<p>
										{thankYou.message}
									</p>
									<p></p>
									<div class="mt-6 divide-y divide-gray-200 border-t border-b border-gray-200">
										<div class="py-10 lg:grid lg:grid-cols-12 lg:gap-x-8">
											<div
												class="lg:col-span-8 lg:col-start-5 xl:col-span-9 xl:col-start-4 xl:grid xl:grid-cols-3 xl:items-start xl:gap-x-8"
											>
												<div class="xl:col-span-2">
													<div class=" space-y-6 text-sm text-gray-500">
														<p>
															{thankYou.message}
														</p>
													</div>
												</div>
											</div>

											<div
												class="mt-6 flex items-center text-sm lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:mt-0 lg:flex-col lg:items-start xl:col-span-3"
											>
												{#each thankYou.contacts as contact}
													<p class="font-medium text-gray-900">{contact.firstName}</p>
												{/each}
											</div>
										</div>
									</div>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>
		</div>
		<div class="space-y-4">
			<Card>
				<div class="space-y-6">
					<!-- Company -->
					<div class="flex w-full flex-none gap-x-4">
						<dt class="flex-none">
							<span class="sr-only">Company</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
								/>
							</svg>
						</dt>
						{#if $myMeeting.data?.jobApp?.company}
							<dd class="text-sm/6 text-gray-500">
								<p>{$myMeeting.data?.jobApp?.company}</p>
							</dd>
						{:else if $myMeeting.data?.jobPosition?.company}
							<dd class="text-sm/6 text-gray-500">
								<p>{$myMeeting.data?.jobPosition?.company}</p>
							</dd>
						{:else}
							<dd class="text-sm/6 text-gray-500">
								<p>N/A</p>
							</dd>
						{/if}
					</div>
					<!-- Position -->
					<div class="flex w-full flex-none gap-x-4">
						<dt class="flex-none">
							<span class="sr-only">Position</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
								/>
							</svg>
						</dt>
						{#if $myMeeting.data?.jobApp?.title}
							<dd class="text-sm/6 text-gray-500">
								<p>{$myMeeting.data?.jobApp?.title}</p>
							</dd>
						{:else if $myMeeting.data?.jobPosition?.name}
							<dd class="text-sm/6 text-gray-500">
								<p>{$myMeeting.data?.jobPosition.name}</p>
							</dd>
						{:else}
							<dd class="text-sm/6 text-gray-500">
								<p>N/A</p>
							</dd>
						{/if}
					</div>
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
							<p>{$myMeeting.data?.type}</p>
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
							<time>{format($myMeeting.data?.time || new Date(), 'Pp')}</time>
						</dd>
					</div>

					{#if $myMeeting.data?.location}
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
								<p>{$myMeeting.data?.location}</p>
							</dd>
						</div>
					{/if}

					{#if $myMeeting.data?.link}
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
									href={$myMeeting.data?.link}
									onclick={() => trackingStore.trackAction('Meeting Link Click')}
									target="_blank"
									class="text-primary hover:text-primary-700">Meeting Link</a
								>
							</dd>
						</div>
					{/if}
				</div>
			</Card>
			{#if $myMeeting.data?.jobApp}
				{@const jobApp = $myMeeting.data?.jobApp}
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

<Drawer
	bind:isOpen={showMeetingDetails}
	title="Update Your Meeting"
	subTitle="Update your meeting so you can find it later"
	saveFormID="updateMeeting"
>
	<MeetingForm
		id="updateMeeting"
		meetingID={data.meetingID}
		meeting={$myMeeting.data}
		onSuccess={() => {
			showMeetingDetails = false;
			$myMeeting.refetch();
		}}
	/>
</Drawer>
