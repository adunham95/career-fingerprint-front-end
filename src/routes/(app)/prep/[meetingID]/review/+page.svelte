<script lang="ts">
	import { useMeetingHighlightsQuery } from '$lib/API/highlights';
	import { useGetAnswersByMeetingID } from '$lib/API/prep-answers';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import { onMount } from 'svelte';
	import StepHeader from '../StepHeader.svelte';
	import { format } from 'date-fns';
	import { trackingStore } from '$lib/Stores/tracking';
	import { goto } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import PremiumBadge from '$lib/Components/PremiumBadge.svelte';

	const { data } = $props();

	console.log({ data });

	const meetingHighlights = useMeetingHighlightsQuery(
		data.meetingID || '',
		data.meeting?.highlights || []
	);

	onMount(() => {
		trackingStore.pageViewEvent('Meeting Prep - Review');
	});
</script>

<PageContainer>
	<StepHeader
		currentStep={3}
		meetingID={data.meetingID || ''}
		onFinish={() => {
			goto('/dashboard');
		}}
	/>
	<div class="flex justify-end">
		<button
			class="btn btn-text--primary print:hidden"
			onclick={() => {
				window.print();
				trackingStore.trackAction('Print Cheatsheet');
			}}>Print</button
		>
		<a
			class="btn btn--primary relative ml-2 flex justify-center"
			target="_blank"
			download
			href={`${PUBLIC_API_URL}/meetings/${data.meetingID}/pdf`}
			onclick={() => trackingStore.trackAction('Download Cheatsheet')}
			>Download Cheatsheet
			<PremiumBadge />
		</a>
	</div>
	<div class="mx-auto max-w-3xl px-4 py-4 sm:px-6 sm:py-8 lg:px-8 print:w-full print:p-0">
		<p class="hidden print:block">Your Career Fingerprint Meeting Guide</p>
		<div class="max-w-xl">
			<p class="font-title mt-2 text-4xl font-bold tracking-tight sm:text-5xl print:text-2xl">
				{data?.meeting?.title || ''}
			</p>
			{#if data?.meeting?.time}
				<p class="mt-2 text-base text-gray-500">
					{format(data.meeting.time, 'PPPP p')}
				</p>
			{/if}
			{#if data?.meeting?.jobPosition}
				<p class="mt-2 text-base text-gray-500">
					{data.meeting.jobPosition.name} | {data.meeting.jobPosition.location}
				</p>
			{/if}
		</div>
		<div class="mt-4">
			{#if $meetingHighlights.data && $meetingHighlights.data.length > 0}
				<h2 class="text-lg">Highlights</h2>
				<div
					class="mt-1 mb-2 hidden gap-x-8 gap-y-10 border-b border-gray-300 pb-6 md:grid md:grid-cols-3 print:grid-cols-3"
				>
					<p>Highlight</p>
					<p>Notes</p>
					<p>Achievements</p>
				</div>
				{#each $meetingHighlights.data as highlight}
					<div
						class="mb-2 grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-300 pb-6 md:grid-cols-3 print:grid-cols-3"
					>
						<div>
							<h2 class="text-base/7 font-semibold text-gray-900">"{highlight.text}"</h2>
						</div>
						<div>
							{#each highlight.notes as note}
								<p>{note.note}</p>
							{/each}
						</div>

						<div class=" gap-x-6 gap-y-8">
							<ul>
								{#each highlight.achievements as ach}
									<li>{ach.myContribution}</li>
								{/each}
							</ul>
						</div>
					</div>
				{/each}
			{/if}
		</div>
		<div class="mt-4">
			<div class="grid grid-cols-3 gap-1">
				{#each data.prepAnswers || [] as answer}
					<div
						class="divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-600 bg-white"
					>
						<div class="px-2 py-2.5">{answer.question.question}</div>
						<div class="px-2 py-2.5">{answer.answer}</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</PageContainer>
