<script>
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import Label from '$lib/Components/FormElements/Label.svelte';
	import TextArea from '$lib/Components/FormElements/TextArea.svelte';
	import NavPillButtons from '$lib/Components/Header/NavPillButtons.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast';
	import { trackingStore } from '$lib/Stores/tracking';
	import { formatDate } from '$lib/Utils/formatDate';
	import { onMount } from 'svelte';

	const { data } = $props();

	onMount(() => {
		trackingStore.pageViewEvent('Demo Meeting');
	});

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
					<a
						href="/demo"
						type="button"
						class="btn btn--primary"
						onclick={() => {
							trackingStore.trackAction('Finish Meeting Click');
						}}
					>
						Finish Meeting
					</a>
				</div>
			</div>
			<Label label="Take Notes" />
			<TextArea id="note" label="Note" hideLabel placeholder="Note" rows={4} />
			<div class="flex justify-end">
				<button
					class="btn btn-text--primary"
					onclick={() => {
						trackingStore.trackAction('Add Note Click');
						toastStore.show({ message: 'Note Saved', type: 'success' });
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
					</ul>
				{:else if current === 'details'}
					<p class="">
						Job Description: Responsible for performing day-to-day tasks to support team objectives
						and organizational goals. This included planning and executing work assignments,
						maintaining communication with team members and stakeholders, and ensuring tasks were
						completed accurately and on time. Collaborated with others to improve processes, solve
						problems, and deliver high-quality results. Maintained a strong focus on reliability,
						efficiency, and professional growth throughout the role.
					</p>
				{:else if current === 'notes'}
					<ul class="space-y-2">
						{#each data.notes as note}
							<li>
								<Card size="sm">
									<p>{note.note}</p>
								</Card>
							</li>
						{/each}
					</ul>
				{:else if current === 'highlights'}
					<ul class="space-y-2">
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
				{:else if current === 'questions'}
					<ul class="space-y-2">
						{#each data.questions || [] as answer}
							<li>
								<Card size="sm" headline={answer.question.question}>
									<p>{answer.answer}</p>
								</Card>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		</div>
	</div>
</PageContainer>
