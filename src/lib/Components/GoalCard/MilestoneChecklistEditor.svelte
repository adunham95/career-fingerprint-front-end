<script lang="ts">
	import { useCheckoffMilestone, useGetMilestoneDetails } from '$lib/API/goals';
	import CheckRow from '../FormElements/CheckRow.svelte';
	import Loader from '../Loader.svelte';
	import type { BaseMilestoneEditorProps } from './milestoneEditorBase';

	const { milestone }: BaseMilestoneEditorProps = $props();

	const checklistItems = useGetMilestoneDetails(milestone.id, 'checklist');
	const updateChecklistItemsMutation = useCheckoffMilestone(milestone.id, 'checklist');

	function onCheck(id: string, checked: boolean) {
		console.log(id, checked);
		try {
			const res = $updateChecklistItemsMutation.mutateAsync({
				milestoneID: milestone.id,
				type: 'checklist',
				body: { checked, key: id }
			});
		} catch (error) {
			console.log(error);
		}
	}
</script>

<div class="flex flex-1 flex-col px-5 py-6">
	<!-- Center content -->
	<div class="flex flex-1 flex-col items-center justify-center">
		<!-- Icon -->
		<div class="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
			<div class="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/10">
				<!-- Check icon -->
				<svg viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5 text-slate-900">
					<path
						fill-rule="evenodd"
						d="M16.704 5.29a1 1 0 010 1.415l-7.25 7.25a1 1 0 01-1.414 0l-3.25-3.25A1 1 0 016.204 9.29l2.543 2.543 6.543-6.543a1 1 0 011.414 0z"
						clip-rule="evenodd"
					/>
				</svg>
			</div>
		</div>

		<div class="text-center">
			<p class="text-xs font-semibold tracking-wider text-slate-500 uppercase">Checklist Goal</p>
			<h3 class="mt-2 text-lg font-semibold text-slate-900">Mark this as complete?</h3>
			<p class="mt-2 max-w-sm text-sm text-slate-600">
				This will update your overall progress. You can always change it later.
			</p>
		</div>

		<!-- Checklist preview -->
		<div class="mt-6 w-full max-w-sm">
			<div class="rounded-2xl border border-slate-200 bg-white shadow-sm">
				<div class="border-b border-slate-200 px-4 py-3">
					<p class="text-sm font-semibold text-slate-900">Completed items</p>
					<p class="mt-1 text-xs text-slate-500">Review what you’re checking off.</p>
				</div>

				{#if $checklistItems.isLoading}
					<div class="flex justify-center py-2"><Loader /></div>
				{/if}

				<ul class="divide-y divide-slate-100">
					{#each $checklistItems.data?.checklistItems as checkItem}
						<li class=" px-4 py-3">
							<CheckRow
								id={checkItem.key}
								label={checkItem.label}
								checked={checkItem.checked}
								onChange={onCheck}
							/>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</div>
