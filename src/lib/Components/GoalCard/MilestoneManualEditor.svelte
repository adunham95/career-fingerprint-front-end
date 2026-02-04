<script lang="ts">
	import { useCheckoffMilestone, useGetMilestoneDetails } from '$lib/API/goals';
	import Loader from '../Loader.svelte';
	import type { BaseMilestoneEditorProps } from './milestoneEditorBase';

	interface Props extends BaseMilestoneEditorProps {}

	const { milestone }: Props = $props();

	const manualItem = useGetMilestoneDetails(milestone.id, 'manual');
	const updateManualMilestone = useCheckoffMilestone(milestone.id, 'manual');

	async function markComplete(checked = true) {
		try {
			await $updateManualMilestone.mutateAsync({
				milestoneID: milestone.id,
				type: 'manuel',
				body: { checked }
			});
		} catch (error) {
			console.log(error);
		}
	}
</script>

{#if $manualItem.isLoading}
	<div class="flex justify-center">
		<Loader />
	</div>
{/if}
<div class="flex flex-1 flex-col items-center justify-center text-center">
	<!-- Icon -->
	<div class="bg-primary-100 mb-4 flex h-14 w-14 items-center justify-center rounded-full">
		<div class="bg-primary-900/10 flex h-9 w-9 items-center justify-center rounded-full">
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

	<p class="text-xs font-semibold tracking-wider text-slate-500 uppercase">Manual Goal</p>
	<h3 class="mt-2 text-lg font-semibold text-slate-900">Mark this as complete?</h3>

	<p class="mt-2 max-w-sm text-sm text-slate-600">
		This will update your overall progress. You can always edit or reopen it later.
	</p>

	{#if $manualItem.data?.setUp === false || $manualItem.data?.checked === false}
		<button type="button" class="btn btn--primary mt-6 w-full" onclick={() => markComplete(true)}>
			Mark as complete
		</button>
	{:else}
		<button type="button" class="btn btn--warning mt-6 w-full" onclick={() => markComplete(false)}>
			UnComplete this Item
		</button>
	{/if}
</div>
