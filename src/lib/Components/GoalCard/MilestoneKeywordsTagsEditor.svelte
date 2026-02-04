<script lang="ts">
	import { useGetMilestoneDetails } from '$lib/API/goals';
	import type { BaseMilestoneEditorProps } from './milestoneEditorBase';

	interface Props extends BaseMilestoneEditorProps {}

	const { milestone }: Props = $props();

	const milestoneDetails = useGetMilestoneDetails(milestone.id, 'keywords_tags');

	function niceMatchReason(reason?: string | null) {
		if (!reason) return null;
		// e.g. "keyword:presented" -> "presented"
		const [kind, value] = reason.split(':');
		if (!value) return reason;
		return value;
	}

	function formatDate(d?: string | Date | null) {
		if (!d) return null;
		const date = typeof d === 'string' ? new Date(d) : d;
		if (Number.isNaN(date.getTime())) return null;
		return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
	}
</script>

<div class="flex flex-1 flex-col px-5 py-6">
	<div class="flex flex-1 flex-col items-center justify-center">
		<!-- Icon -->
		<div class="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
			<div class="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/10">
				<svg viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5 text-slate-900">
					<path
						fill-rule="evenodd"
						d="M16.704 5.29a1 1 0 010 1.415l-7.25 7.25a1 1 0 01-1.414 0l-3.25-3.25A1 1 0 016.204 9.29l2.543 2.543 6.543-6.543a1 1 0 011.414 0z"
						clip-rule="evenodd"
					/>
				</svg>
			</div>
		</div>

		<div class="w-full max-w-md text-center">
			<p class="text-xs font-semibold tracking-wider text-slate-500 uppercase">Evidence Goal</p>
			<p class="mt-2 text-sm text-slate-600">
				Linked achievements automatically captured for this milestone.
			</p>

			{#if $milestoneDetails.isLoading}
				<div class="mt-6 space-y-3 text-left">
					<div class="h-16 rounded-2xl border border-slate-200 bg-white/60"></div>
					<div class="h-16 rounded-2xl border border-slate-200 bg-white/60"></div>
				</div>
			{:else if ($milestoneDetails.data?.linkedAchievements?.length ?? 0) === 0}
				<div
					class="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-4 text-left"
				>
					<p class="text-sm font-medium text-slate-900">No linked achievements yet</p>
					<p class="mt-1 text-sm text-slate-600">
						Add an achievement that includes one of your tracked keywords/tags and it’ll show up
						here.
					</p>
				</div>
			{:else}
				<ul class="mt-6 flex flex-col gap-y-3 text-left">
					{#each $milestoneDetails.data?.linkedAchievements as ach (ach.id)}
						{@const a = ach.achievement}
						{@const headline = a?.result || a?.description || 'Achievement'}
						{@const match = niceMatchReason(ach.matchReason)}
						{@const date = formatDate(a?.startDate)}

						<li
							class="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
						>
							<div class="space-y-2 px-4 py-3">
								<!-- top row meta -->
								<div class="flex items-center justify-between gap-3">
									<div class="flex items-center gap-2">
										{#if ach.linkType === 'auto'}
											<span
												class="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
											>
												Auto-linked
											</span>
										{:else}
											<span
												class="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
											>
												Linked
											</span>
										{/if}

										{#if match}
											<span class="text-[11px] text-slate-500">
												Matched <span class="font-medium text-slate-700">“{match}”</span>
											</span>
										{/if}
									</div>

									{#if date}
										<span class="text-[11px] text-slate-500">{date}</span>
									{/if}
								</div>

								<!-- headline -->
								<p class="line-clamp-2 text-sm leading-snug font-semibold text-slate-900">
									{headline}
								</p>

								<!-- contribution -->
								{#if a?.myContribution}
									<p class="line-clamp-2 text-sm text-slate-600">
										<span class="font-medium text-slate-700">Contribution:</span>
										{a.myContribution}
									</p>
								{/if}

								<!-- optional context -->
								{#if a?.description && a.description !== headline}
									<p class="line-clamp-2 text-xs text-slate-500">{a.description}</p>
								{/if}
							</div>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
</div>
