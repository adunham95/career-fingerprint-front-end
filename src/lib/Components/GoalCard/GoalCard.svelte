<script lang="ts">
	import { milestoneColors, milestoneTypeKeyMap } from '$lib/Utils/MilestonesData';
	import type { Goal } from '../../../app';
	import Card from '../Containers/Card.svelte';
	import Drawer from '../Overlays/Drawer.svelte';
	import Progress from '../Progress.svelte';
	import StackedProgress from '../StackedProgress.svelte';
	import MilestoneChecklistEditor from './MilestoneChecklistEditor.svelte';
	import MilestoneKeywordsTagsEditor from './MilestoneKeywordsTagsEditor.svelte';
	import MilestoneManualEditor from './MilestoneManualEditor.svelte';
	import MilestoneStreakEditor from './MilestoneStreakEditor.svelte';

	let openMilestoneId = $state<null | string>(null);

	interface Props {
		goalItem: Goal;
	}

	const { goalItem }: Props = $props();

	const activeMilestone = $derived(
		openMilestoneId ? goalItem.milestones.find((m) => m.id === openMilestoneId) : null
	);

	const drawerTitle = $derived(
		activeMilestone
			? `${milestoneTypeKeyMap?.[activeMilestone.kind] ?? 'Milestone'}: ${activeMilestone.title}`
			: ''
	);
</script>

<Card>
	<div class="relative flex flex-1 flex-col">
		<h3 class="pb-2 text-base font-medium text-gray-900">{goalItem.title}</h3>
		<p class="pb-2 text-sm font-medium text-gray-700">{goalItem.description}</p>
		<div class="mb-2">
			<div class="flex justify-between">
				<h5 class="text-sm font-medium text-gray-900">Overall Progress</h5>
				<p>{goalItem.progress}%</p>
			</div>
			<StackedProgress
				segments={goalItem.milestones.map((g) => {
					return {
						currentValue: g.progress,
						totalValue: g.targetCount,
						color: milestoneColors?.[g.kind].primary || '#ffa3ba'
					};
				})}
			/>
		</div>
		<div class="my-4 border-b border-gray-300/50"></div>
		<h3 class="pb-2">Milestones ({goalItem.milestones.length})</h3>
		<dl class="flex grow flex-col justify-between gap-y-4">
			{#each goalItem.milestones.sort((a, b) => a.order - b.order) as milestone}
				<button
					type="button"
					onclick={() => (openMilestoneId = milestone.id)}
					class="flex justify-between rounded-xl border border-gray-300 p-3 text-left transition-shadow hover:shadow-lg"
				>
					<dt class="w-2/3 text-base text-gray-900">
						<p>
							{milestone.title}
						</p>
						<p class="text-sm text-gray-500">
							{milestoneTypeKeyMap?.[milestone.kind] || 'Unknown'}
						</p>
					</dt>
					<dd class="w-1/3">
						<p class="text-caption pb-0.5 text-end text-gray-500">
							{#if milestone.kind === 'keywords_tags'}
								{milestone.progress}/{milestone.targetCount} Linked Evidence
							{:else if milestone.kind === 'checklist'}
								{milestone.progress}/{milestone.targetCount} Checked
							{:else if milestone.kind === 'streak'}
								Streak {milestone.progress} of {milestone.targetCount}
							{:else if milestone.kind === 'manual'}
								Manual Item
							{/if}
						</p>
						<Progress
							value={milestone.progress}
							max={milestone.targetCount}
							color={milestoneColors?.[milestone.kind].primary || '#ffa3ba'}
						/>
					</dd>
				</button>
			{/each}
		</dl>
	</div>
</Card>

<Drawer
	title={drawerTitle}
	isOpen={!!openMilestoneId}
	onClose={() => {
		openMilestoneId = null;
	}}
>
	{#if activeMilestone}
		{#if activeMilestone.kind === 'checklist'}
			<MilestoneChecklistEditor milestone={activeMilestone} />
		{:else if activeMilestone.kind === 'keywords_tags'}
			<MilestoneKeywordsTagsEditor milestone={activeMilestone} />
		{:else if activeMilestone.kind === 'streak'}
			<MilestoneStreakEditor milestone={activeMilestone} />
		{:else}
			<MilestoneManualEditor milestone={activeMilestone} />
		{/if}
	{/if}
</Drawer>
