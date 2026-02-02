<script lang="ts">
	import type { BaseMilestoneEditorProps } from './milestoneEditorBase';

	interface Props extends BaseMilestoneEditorProps {}

	const { milestone }: Props = $props();
</script>

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

	<p class="text-xs font-semibold tracking-wider text-slate-500 uppercase">Streak Goal</p>
	<h3 class="mt-2 text-lg font-semibold text-slate-900">Check in for this week?</h3>

	<p class="mt-2 max-w-sm text-sm text-slate-600">This will update your overall progress.</p>

	<div class="flex flex-col justify-center pt-3">
		<p class=" text-5xl font-bold">5</p>
		<p class=" text-sm text-gray-500">Week Streak</p>
	</div>
	<div class="flex justify-between gap-x-4 py-3">
		<dt class="text-gray-500">Last Check In</dt>
		<dd class="text-gray-700"><time datetime="2023-01-22">January 22, 2025</time></dd>
	</div>

	<!-- Place holder -->
	<button type="button" class="btn btn--primary mt-6 w-full"> Check in for this week </button>

	<!-- {#if $manualItem.data?.setUp === false || $manualItem.data?.checked === false}
		<button type="button" class="btn btn--primary mt-6 w-full" onclick={() => markComplete(true)}>
			Mark as complete
		</button>
	{:else}
		<button type="button" class="btn btn--warning mt-6 w-full" onclick={() => markComplete(false)}>
			UnComplete this Item
		</button>
	{/if} -->
</div>

<div></div>
