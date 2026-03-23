<script>
	export let streak = 0;

	const DOT_COUNT = 8;

	$: message =
		streak === 0
			? 'Log an achievement this week to begin'
			: streak < 4
				? 'Building momentum — keep going'
				: streak < 12
					? 'Consistency is compounding'
					: "You're in rare company";

	$: dots = Array.from({ length: DOT_COUNT }, (_, i) => {
		const pos = streak - (DOT_COUNT - 1) + i;
		if (pos === streak && streak > 0) return 'current';
		if (pos > 0 && pos < streak) return 'active';
		return 'empty';
	});
</script>

<div
	class="bg-secondary relative flex h-16 w-full items-center overflow-hidden rounded-[10px] px-7 shadow-[0_2px_12px_rgba(17,58,93,0.14)]"
>
	<!-- Shimmer sweep -->
	<div
		class="animate-shimmer pointer-events-none absolute inset-0 z-10
           bg-[linear-gradient(105deg,transparent_35%,rgba(255,255,255,0.03)_50%,transparent_65%)]
           bg-[length:200%_100%]"
	></div>

	<!-- Content row -->
	<div class="relative flex w-full items-center gap-5">
		<!-- Streak number -->
		<span
			class="font-title text-primary min-w-[1ch] text-[2.1rem] leading-none font-bold tracking-tight"
		>
			{streak}
		</span>

		<!-- Divider -->
		<div class="bg-background/15 h-7 w-px shrink-0"></div>

		<!-- Label + subtext -->
		<div class="flex flex-1 flex-col gap-0.5">
			<span
				class="font-paragraph text-background text-[0.75rem] font-bold tracking-[0.13em] uppercase"
			>
				Week streak
			</span>
			<span class="font-paragraph text-background/50 text-[0.7rem] font-light tracking-wide">
				{message}
			</span>
		</div>

		<!-- Dot track -->
		<div class="ml-auto flex items-center gap-[5px]">
			{#each dots as state}
				<span
					class="h-1.5 w-1.5 rounded-full transition-colors duration-300 {state === 'current'
						? 'bg-primary'
						: state === 'active'
							? 'bg-accent/70'
							: 'bg-background/15'}"
				></span>
			{/each}
		</div>
	</div>
</div>
