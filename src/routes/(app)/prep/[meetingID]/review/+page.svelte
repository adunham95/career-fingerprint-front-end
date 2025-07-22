<script lang="ts">
	import { useMeetingHighlightsQuery } from '$lib/API/highlights';
	import { useGetAnswersByMeetingID } from '$lib/API/prep-answers';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import StepHeader from '../StepHeader.svelte';
	import { format } from 'date-fns';

	const { data } = $props();

	console.log({ data });

	const meetingHighlights = useMeetingHighlightsQuery(
		data.meetingID || '',
		data.meeting.highlights
	);
</script>

<PageContainer>
	<StepHeader currentStep={3} meetingID={data.meetingID || ''} />
	<div class="flex justify-end">
		<button class="btn btn--primary print:hidden" onclick={() => window.print()}>Print</button>
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
				{#each $meetingHighlights.data as highlight}
					<div
						class="mb-2 grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-300 pb-6 md:grid-cols-3 print:grid-cols-3"
					>
						<div>
							<h2 class="text-base/7 font-semibold text-gray-900">"{highlight.text}"</h2>
						</div>

						<div class=" gap-x-6 gap-y-8 md:col-span-2">
							{#each highlight.notes as note}
								<p>Note: {note.note}</p>
							{/each}
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
				{#each data.prepAnswers as answer}
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
