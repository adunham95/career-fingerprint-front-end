<script lang="ts">
	interface Props {
		trialLimit?: number;
		currentAchievementCount?: number;
		isTrial?: boolean;
	}

	const { trialLimit = 15, currentAchievementCount = 0, isTrial = false }: Props = $props();

	let remaining = $derived(trialLimit - currentAchievementCount);
	let percent = $derived(Math.min((currentAchievementCount / trialLimit) * 100, 100));
	let isNearLimit = $derived(remaining <= 3 && remaining > 0);
	let isAtLimit = $derived(remaining <= 0);
</script>

{#if isTrial}
	<div
		class="bg-secondary mt-5 flex flex-col items-center justify-between gap-4 rounded-lg px-5 py-3 md:flex-row md:flex-wrap"
	>
		<!-- Left: label + progress bar + count -->
		<div class="flex w-full min-w-0 flex-1 flex-col items-center gap-3 md:flex-row">
			<span class=" text-primary font-semibold tracking-widest uppercase"> Free trial </span>

			<div class="h-1 w-full shrink-0 overflow-hidden rounded-full bg-white/15 md:w-36">
				<div
					class="h-full rounded-full transition-all duration-400 ease-in-out
            {isAtLimit ? 'bg-primary' : isNearLimit ? 'bg-warning-400' : 'bg-accent'}"
					style="width: {percent}%"
				></div>
			</div>

			<span class="font-ui text-[0.8rem] text-white/60">
				{#if isAtLimit}
					{trialLimit} of {trialLimit} achievements used
				{:else}
					{currentAchievementCount} of {trialLimit} used &mdash; {remaining} left
				{/if}
			</span>
		</div>

		<!-- Right: limit message + CTA -->
		<div class="flex shrink-0 flex-col items-center gap-3 md:flex-row">
			{#if isAtLimit}
				<span class="font-ui text-warning-400 text-[0.8rem]"> You've reached the free limit. </span>
			{/if}

			<a
				href="?"
				class="btn
          {isAtLimit
					? 'bg-primary hover:bg-primary-600 text-white'
					: 'bg-accent text-secondary hover:bg-accent-600'}"
			>
				Upgrade to unlock more
			</a>
		</div>
	</div>
{/if}
