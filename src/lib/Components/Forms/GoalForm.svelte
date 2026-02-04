<script lang="ts">
	import { useCreateGoal } from '$lib/API/goals';
	import ChipList from '../FormElements/ChipList.svelte';
	import Label from '../FormElements/Label.svelte';
	import Select from '../FormElements/Select.svelte';
	import TextArea from '../FormElements/TextArea.svelte';
	import TextInput from '../FormElements/TextInput.svelte';
	import TextList from '../FormElements/TextList.svelte';
	import InfoBlock from '../InfoBlock.svelte';

	const createGoalMutation = useCreateGoal();

	interface Props {
		template?: GoalFormTemplate | null;
		onSuccess?: () => void;
	}

	const { template = null, onSuccess }: Props = $props();

	type GoalStepKind = 'manual' | 'checklist' | 'keywords_tags' | 'streak';

	type MilestoneCard = {
		type: GoalStepKind | '';
		title: string;
		keywords: string[];
		streak: number; // total weeks
		checklist: string[];
		targetCount: number;
	};

	type GoalFormTemplate = {
		templateKey?: string;
		title: string;
		description: string;
		milestones: MilestoneCard[];
	};

	let details: GoalFormTemplate = $state({
		templateKey: 'custom',
		title: '',
		description: '',
		milestones: []
	});

	function normalizeTemplate(t: GoalFormTemplate): GoalFormTemplate {
		return {
			templateKey: t.templateKey,
			title: t.title ?? '',
			description: t.description ?? '',
			milestones: (t.milestones ?? []).map((m) => ({
				type: (m.type ?? '') as MilestoneCard['type'],
				title: m.title ?? '',
				keywords: Array.isArray(m.keywords) ? [...m.keywords] : [],
				streak: typeof m.streak === 'number' ? m.streak : 0,
				targetCount: typeof m.targetCount === 'number' ? m.targetCount : 0,
				checklist: Array.isArray(m.checklist) ? [...m.checklist] : []
			}))
		};
	}

	$effect(() => {
		if (!template) return;
		details = normalizeTemplate(template);
	});

	function createGoal() {
		try {
			const res = $createGoalMutation.mutateAsync(details);
			onSuccess?.();
		} catch (error) {}
	}
</script>

<form
	id="newGoal"
	onsubmit={(e) => {
		e.preventDefault();
		createGoal();
	}}
>
	<TextInput id="title" label="Goal Name" bind:value={details.title} />
	<TextArea id="description" label="Description" bind:value={details.description} />
	<div class="flex justify-between pt-4 pb-1">
		<p>Milestones</p>
		<button
			type="button"
			class="btn btn-small btn--primary flex items-center"
			onclick={() => {
				details.milestones.push({
					type: '',
					title: '',
					keywords: [],
					streak: 0,
					checklist: [],
					targetCount: 0
				});
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="mr-1 size-5"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
			</svg>
			<span> Add Milestones </span>
		</button>
	</div>
	<p class="mb-4 border-b border-gray-300 pb-4 text-sm text-gray-500">
		Milestones define how you’ll track progress toward this goal. You can mix and match different
		tracking methods.
	</p>
	<div class="space-y-6">
		{#each details.milestones as card, idx}
			<div class="relative space-y-6 rounded-sm border border-gray-300 bg-white p-4">
				<div class="flex justify-between">
					<div class="flex items-center">
						<Label label="Tracking Method" labelClassName="mr-1" />
						<Select
							bind:value={card.type}
							options={[
								{ id: '', label: 'Select a Method' },
								{ id: 'manual', label: 'Manual Entry' },
								{ id: 'checklist', label: 'Checklist' },
								{ id: 'streak', label: 'Streak' },
								{ id: 'keywords_tags', label: 'Achievement Evidence' }
							]}
						/>
					</div>
					<button
						type="button"
						onclick={() => {
							details.milestones.splice(idx, 1);
						}}
						class="text-error-500 hover:bg-error-200 absolute top-1 right-1 flex items-center rounded-full p-2 hover:text-gray-50"
						><svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="size-4"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
							/>
						</svg>
						<span class="sr-only">Delete</span>
					</button>
				</div>
				<TextInput id="milestoneTitle" label="Milestone Title" bind:value={card.title} />
				<div class="border-t border-gray-300 pt-2">
					{#if card.type === 'checklist'}
						<p>Checklist Items</p>
						<InfoBlock
							className="my-2"
							icon="lightbulb"
							title="Checklist Items"
							description="Complete all items to finish this milestone."
						/>
						<TextList
							id={`card-${idx}`}
							bind:values={card.checklist}
							placeholder="Add Checklist item"
							addButtonText="Add Checklist Item"
						/>
					{:else if card.type === 'streak'}
						<p>Number of weeks</p>
						<InfoBlock
							className="my-2"
							icon="lightbulb"
							title="Streak"
							description="A weekly check in streak for keeping up habits. Check in once per week to maintain your streak. Missing a week resets the streak. e.g. Weekly check-ins with manager"
						/>
						<TextInput min={0} max={20} id="weekly" type="number" bind:value={card.streak} />
					{:else if card.type === 'keywords_tags'}
						<p>Achievement Keywords</p>
						<InfoBlock
							className="my-2"
							icon="lightbulb"
							title="Achievement Evidence"
							description="Automatically counts achievements that include these keywords."
						/>
						<TextInput
							label="Target Count (required to complete this milestone)"
							min={0}
							max={100}
							id="tagCount"
							type="number"
							bind:value={card.targetCount}
						/>
						<ChipList bind:chips={card.keywords} />
					{:else if card.type === 'manual'}
						<p>Manual</p>
						<InfoBlock
							icon="lightbulb"
							className="my-2"
							title="Manual"
							description="Mark this milestone complete when you decide it’s done. Best for conversations, alignment, or one-time actions."
						/>
					{/if}
				</div>
			</div>
		{/each}
		{#if details.milestones.length === 0}
			<InfoBlock
				title="Empty Milestones"
				description="Milestones help you break a goal into measurable steps. You can track progress using achievements, checklists, streaks, or simple manual completion."
			>
				{#snippet actions()}
					<div class="flex justify-end">
						<button
							type="button"
							class="btn btn-small btn-text--info flex items-center"
							onclick={() => {
								details.milestones.push({
									type: '',
									title: '',
									keywords: [],
									streak: 0,
									checklist: [],
									targetCount: 0
								});
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="mr-1 size-5"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
							</svg>
							<span> Add Milestones </span>
						</button>
					</div>
				{/snippet}
			</InfoBlock>
		{/if}
	</div>
</form>
