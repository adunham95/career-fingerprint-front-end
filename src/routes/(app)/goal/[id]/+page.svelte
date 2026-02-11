<script>
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import Progress from '$lib/Components/Progress.svelte';

	const placeholderGoal = {
		templateKey: 'test_mixed_metrics_v1',
		goal: {
			title: 'Grow Into a Senior Engineer Role',
			description: 'A test goal that exercises all v1 metric types.',
			active: true,
			started: '1-1-2026'
		},
		steps: [
			{
				order: 1,
				title: 'Demonstrate strong technical decision-making',
				kind: 'keywords_tags',
				progress: 2,
				targetCount: 3,
				metricConfig: {
					targetCount: 3,
					keywords: ['decision', 'tradeoff', 'RFC', 'proposal'],
					tags: ['architecture', 'technical-design']
				}
			},
			{
				order: 2,
				title: 'Prepare core senior-level examples',
				kind: 'checklist',
				metricConfig: {},
				progress: 1,
				targetCount: 3,
				checklistItems: [
					{ key: 'ownership', label: 'Ownership example', order: 1 },
					{ key: 'decision', label: 'Technical decision example', order: 2 },
					{ key: 'impact', label: 'High-impact delivery example', order: 3 }
				]
			},
			{
				order: 3,
				title: 'Practice senior-level behaviors weekly',
				kind: 'streak',
				progress: 2,
				targetCount: 8,
				metricConfig: {
					timesPerWeek: 2,
					weeks: 4
				}
			},
			{
				order: 4,
				title: 'Get manager confirmation of readiness',
				kind: 'manual',
				progress: 0,
				targetCount: 1,
				metricConfig: {}
			}
		]
	};

	const kindKeyMap = {
		manual: 'Manual Goal',
		streak: 'Streak Goal',
		checklist: 'Checklist Goal',
		keywords_tags: 'Evidence Goal'
	};

	export const milestoneColors = {
		streak: {
			primary: '#00BFA6',
			light: '#E6F7F4',
			border: '#7AD9CB'
		},
		checklist: {
			primary: '#3B82F6',
			light: '#EBF2FF',
			border: '#9EC2FF'
		},
		keywords_tags: {
			primary: '#FF7A8A',
			light: '#FFE8EB',
			border: '#FFB3BC'
		},
		manual: {
			primary: '#475569',
			light: '#F1F5F9',
			border: '#CBD5E1'
		}
	};
</script>

<PageContainer>
	<div class="py-4 md:flex md:items-center md:justify-between">
		<div class="min-w-0 flex-1">
			<h2 class="text-2xl font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
				{placeholderGoal.goal.title}
			</h2>
			<p>{placeholderGoal.goal.description}</p>
		</div>
		<div class="mt-4 flex md:mt-0 md:ml-4">
			<button type="button" class="btn btn-text--secondary">Edit</button>
		</div>
	</div>
	<Card>
		<div class="grid grid-cols-2">
			<div class="flex text-sm">
				<h5 class="mr-1 font-medium text-gray-900">Status</h5>
				<p>Active</p>
			</div>
			<div class="flex text-sm">
				<h5 class="mr-1 font-medium text-gray-900">Started</h5>
				<p>January 1 2026</p>
			</div>
			<div class=" col-span-2">
				<div class="flex justify-between">
					<h5 class="text-sm font-medium text-gray-900">Overall Progress</h5>
					<p>60%</p>
				</div>
				<Progress value={60} max={100} />
			</div>
		</div>
	</Card>
	<h2>Milestones</h2>
	<div class="space-y-4">
		{#each placeholderGoal.steps as step}
			<Card headline={step.title}>
				<div class="flex justify-between">
					<p class="text-caption pb-0.5 text-end text-gray-500">
						{#if step.kind === 'keywords_tags'}
							{step.progress}/{step.targetCount} Linked Evidence
						{:else if step.kind === 'checklist'}
							{step.progress}/{step.targetCount} Checked
						{:else if step.kind === 'streak'}
							Streak {step.progress} of {step.targetCount}
						{:else if step.kind === 'manual'}
							Manual Item
						{/if}
					</p>
					<p>60%</p>
				</div>
				{#if step.kind === 'keywords_tags' || step.kind === 'checklist'}
					<Progress
						value={step.progress}
						max={step.targetCount}
						color={milestoneColors?.[step.kind].primary || '#ffa3ba'}
					/>
				{/if}
			</Card>
		{/each}
	</div>
</PageContainer>
