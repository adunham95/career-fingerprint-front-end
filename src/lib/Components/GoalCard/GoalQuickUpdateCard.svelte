<script lang="ts">
	import { milestoneColors, milestoneTypeKeyMap } from '$lib/Utils/MilestonesData';
	import type { Goal, GoalMilestone } from '../../../app';
	import Card from '../Containers/Card.svelte';
	import Drawer from '../Overlays/Drawer.svelte';
	import Progress from '../Progress.svelte';
	import StackedProgress from '../StackedProgress.svelte';
	import MilestoneChecklistEditor from './MilestoneChecklistEditor.svelte';
	import MilestoneKeywordsTagsEditor from './MilestoneKeywordsTagsEditor.svelte';
	import MilestoneManualEditor from './MilestoneManualEditor.svelte';
	import MilestoneStreakEditor from './MilestoneStreakEditor.svelte';

	// ✨ You wire these up to your existing mutation calls
	// (or pass them in as props if you prefer)
	interface Props {
		goalItem: Goal;
	}

	const { goalItem }: Props = $props();

	let openMilestoneId = $state<null | string>(null);

	const activeMilestone = $derived(
		openMilestoneId ? goalItem.milestones.find((m) => m.id === openMilestoneId) : null
	);

	const drawerTitle = $derived(
		activeMilestone
			? `${milestoneTypeKeyMap?.[activeMilestone.kind] ?? 'Milestone'}: ${activeMilestone.title}`
			: ''
	);

	const sortedMilestones = $derived([...goalItem.milestones].sort((a, b) => a.order - b.order));

	function colorFor(m: GoalMilestone) {
		return milestoneColors?.[m.kind].primary || '#ffa3ba';
	}

	function labelFor(m: GoalMilestone) {
		if (m.kind === 'keywords_tags') return `${m.progress}/${m.targetCount} linked`;
		if (m.kind === 'checklist') return `${m.progress}/${m.targetCount} checked`;
		if (m.kind === 'streak') return `week ${m.progress}/${m.targetCount}`;
		return 'manual';
	}

	// keeps rows compact: don’t show huge bars for manual items
	function showProgressBar(m: GoalMilestone) {
		return m.kind !== 'manual';
	}
</script>

<Card>
	<div class="flex flex-col">
		<!-- Header (compact) -->
		<div class="flex items-start justify-between gap-3">
			<div class="min-w-0">
				<h3 class="truncate text-sm font-semibold text-gray-900">{goalItem.title}</h3>
				{#if goalItem.description}
					<p class="mt-0.5 line-clamp-1 text-xs text-gray-600">{goalItem.description}</p>
				{/if}
			</div>

			<div class="shrink-0 text-sm font-semibold text-gray-900">{goalItem.progress}%</div>
		</div>

		<!-- Stacked progress (thin) -->
		<div class="mt-2">
			<StackedProgress
				segments={goalItem.milestones.map((g) => ({
					currentValue: g.progress,
					totalValue: g.targetCount,
					color: milestoneColors?.[g.kind].primary || '#ffa3ba'
				}))}
			/>
		</div>

		<div class="my-3 border-b border-gray-200"></div>

		<!-- Milestones list (actionable rows) -->
		<div class="flex items-center justify-between">
			<h4 class="text-xs font-semibold text-gray-800">
				Milestones <span class="text-gray-500">({goalItem.milestones.length})</span>
			</h4>
		</div>

		<div class="mt-2 space-y-2">
			{#each sortedMilestones as milestone}
				<div class="rounded-xl border border-gray-200 p-3">
					<div class="flex items-start justify-between gap-3">
						<div class="min-w-0">
							<div class="truncate text-xs font-semibold text-gray-900">{milestone.title}</div>
							<div class="mt-0.5 flex items-center gap-2">
								<span class="text-[11px] font-medium text-gray-600">
									{milestoneTypeKeyMap?.[milestone.kind] || 'Milestone'}
								</span>
								<span class="text-[11px] text-gray-500">•</span>
								<span class="text-[11px] font-semibold text-gray-700">{labelFor(milestone)}</span>
							</div>
						</div>

						<!-- Right-side actions: inline + still allow drawer -->
						<div class="flex shrink-0 items-center gap-2">
							{#if milestone.kind === 'checklist'}
								<button
									type="button"
									class="btn btn-small btn-text--secondary"
									onclick={() => {
										openMilestoneId = milestone.id;
									}}
								>
									Check off
								</button>
							{:else if milestone.kind === 'manual'}
								<button
									type="button"
									class="btn btn-small btn-text--secondary"
									onclick={() => (openMilestoneId = milestone.id)}
								>
									Toggle
								</button>
							{:else if milestone.kind === 'streak'}
								<button
									type="button"
									class="btn btn-small btn-text--secondary"
									onclick={() => (openMilestoneId = milestone.id)}
								>
									Check in
								</button>
							{/if}
						</div>
					</div>

					{#if showProgressBar(milestone)}
						<div class="mt-2">
							<Progress
								value={milestone.progress}
								max={milestone.targetCount}
								color={colorFor(milestone)}
							/>
						</div>
					{/if}
				</div>
			{/each}
		</div>
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
