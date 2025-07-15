<script lang="ts">
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import AssignToJob from '$lib/Components/Forms/AssignToJob.svelte';
	import NewMeetingForm from '$lib/Components/Forms/MeetingForm.svelte';
	import NavPillButtons from '$lib/Components/Header/NavPillButtons.svelte';
	import InfoBlock from '$lib/Components/InfoBlock.svelte';
	import { formatDate } from '$lib/Utils/formatDate';

	const { data } = $props();

	console.log({ data });

	let selectedCompany = $state<string | null>(null);

	let current = $state('resume');
</script>

<PageContainer className="py-2">
	<div class="grid grid-cols-1 gap-2 md:grid-cols-2 md:grid-rows-2">
		<div class="flex flex-col gap-2">
			<InfoBlock title="Default Meeting" description="For the free plan" />
		</div>
		<AssignToJob className="block space-y-2 md:hidden" bind:selectedCompany />
		<div class="  row-span-2">
			<NavPillButtons
				bind:currentTab={current}
				tabs={[
					{ id: 'resume', label: 'Resume' },
					{ id: 'achievements', label: 'Achievements' }
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
								<p>{job.description}</p>
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
							</Card>
						{/each}
					</ul>
				{:else if current === 'achievements'}
					<ul class="list-inside list-disc">
						{#each data.achievements || [] as achievement}
							<li>
								{achievement.myContribution}
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		</div>
	</div>
</PageContainer>
