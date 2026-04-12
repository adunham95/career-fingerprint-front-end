<script lang="ts">
	interface Props {
		trialLimit?: number;
		currentAchievementCount?: number;
		isTrial?: boolean;
	}

	const { trialLimit = 10, currentAchievementCount = 0, isTrial = false }: Props = $props();

	let remaining = $derived(trialLimit - currentAchievementCount);
	let percent = $derived(Math.min((currentAchievementCount / trialLimit) * 100, 100));
	let isNearLimit = $derived(remaining <= 3 && remaining > 0);
	let isAtLimit = $derived(remaining <= 0);
	let showHowItWorks = $derived(currentAchievementCount < 4);
</script>

{#if isTrial}
	<div class="bg-secondary w-full overflow-hidden rounded-xl text-white">
		{#if showHowItWorks}
			<div class="px-5 pt-5">
				<p class="mb-2 text-xs font-bold tracking-widest text-white/45 uppercase">How it works</p>
				<div class="flex items-start">
					<div class="flex flex-1 flex-col items-center text-center">
						<div
							class="mb-2 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm font-bold text-white/70"
						>
							1
						</div>
						<p class="mb-1 text-xs leading-snug font-bold tracking-wide text-white md:text-base">
							Check in weekly
						</p>
						<p class="text-xs leading-snug font-light text-white">
							Build confidence by tracking wins as they happen
						</p>
					</div>

					<div class="mx-1 mt-4 text-white/20">›</div>

					<div class="flex flex-1 flex-col items-center text-center">
						<div
							class="mb-2 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm font-bold text-white/70"
						>
							2
						</div>
						<p class="mb-1 text-xs leading-snug font-bold tracking-wide text-white">Log in STAR</p>
						<p class="text-xs leading-snug font-light text-white">
							Structured format that captures what mattered
						</p>
					</div>

					<div class="mx-1 mt-4 text-white/20">›</div>

					<div class="flex flex-1 flex-col items-center text-center">
						<div
							class="mb-2 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm font-bold text-white/70"
						>
							3
						</div>
						<p class="mb-1 text-xs leading-snug font-bold tracking-wide text-white">
							Track against goals
						</p>
						<p class="text-xs leading-snug font-light text-white">
							Link achievements to your goals and see progress
						</p>
					</div>
				</div>
				<div class="mt-4 h-px bg-white/10"></div>
			</div>
		{/if}

		<div class="px-5 pt-4 pb-5">
			<div class="mb-2.5 flex items-center justify-between">
				<span class="text-primary text-xs font-bold tracking-widest uppercase"> Free Trial </span>
				<span class="text-xs text-white/55">
					{#if isAtLimit}
						{trialLimit} of {trialLimit} used
					{:else}
						{currentAchievementCount} of {trialLimit} used &mdash; {remaining} left
					{/if}
				</span>
			</div>

			<div class="mb-4 h-1 w-full overflow-hidden rounded-full bg-white/10">
				<div
					class="h-full rounded-full transition-all duration-500 ease-in-out
						{isAtLimit ? 'bg-primary' : isNearLimit ? 'bg-warning-400' : 'bg-accent'}"
					style="width: {percent}%"
				></div>
			</div>

			<a
				href="/settings/membership"
				class="block w-full rounded-lg py-3 text-center text-sm font-bold tracking-wide no-underline transition duration-150 hover:-translate-y-px hover:brightness-110 active:translate-y-0
					{isAtLimit ? 'bg-primary text-white' : 'bg-accent text-secondary'}"
			>
				Upgrade to unlock more
			</a>
		</div>
	</div>
{/if}
