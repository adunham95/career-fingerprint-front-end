<script lang="ts">
	const LEVEL_COLOR: string[] = [
		'rgba(255,255,255,0.05)',
		'var(--color-primary-300)',
		'var(--color-primary-400)',
		'var(--color-primary-500)',
		'var(--color-primary-600)'
	];

	const LEVEL_RING: string[] = [
		'var(--color-secondary)',
		'var(--color-secondary)',
		'var(--color-secondary)',
		'var(--color-secondary)',
		'var(--color-secondary)'
	];

	const LEVEL_GLOW: string[] = [
		'',
		'',
		'rgba(196,64,79,0.35)',
		'rgba(232,96,110,0.5)',
		'rgba(0,191,166,0.55)'
	];

	interface WeekActivity {
		weekStart: string;
		count: number;
	}

	let { weekData }: { weekData?: WeekActivity[] } = $props();

	interface WeekData {
		date: Date;
		count: number;
		isFuture: boolean;
		types: string[];
		label: string;
	}

	interface MonthData {
		name: string;
		fullName: string;
		weeks: WeekData[];
	}

	interface HoveredState {
		week: WeekData;
		monthName: string;
	}

	function getLevel(count: number): number {
		if (!count) return 0;
		if (count === 1) return 1;
		if (count === 2) return 2;
		if (count === 3) return 3;
		return 4;
	}

	function weekStart(date: Date): Date {
		const d = new Date(date);
		const dow = d.getDay();
		d.setDate(d.getDate() + (dow === 0 ? -6 : 1 - dow));
		d.setHours(0, 0, 0, 0);
		return d;
	}

	function getLast52Weeks(): Date[] {
		const anchor = weekStart(new Date());
		return Array.from({ length: 52 }, (_, i) => {
			const d = new Date(anchor);
			d.setDate(d.getDate() - (51 - i) * 7);
			return d;
		});
	}

	function groupByMonth(weeks: Date[]): { name: string; fullName: string; weeks: Date[] }[] {
		const map = new Map<string, { name: string; fullName: string; weeks: Date[] }>();
		for (const w of weeks) {
			const key = `${w.getFullYear()}-${w.getMonth()}`;
			if (!map.has(key)) {
				map.set(key, {
					name: w.toLocaleDateString('en-US', { month: 'short' }),
					fullName: w.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
					weeks: []
				});
			}
			map.get(key)!.weeks.push(w);
		}
		return [...map.values()];
	}

	function withCounts(
		rawMonths: { name: string; fullName: string; weeks: Date[] }[],
		activityMap: Map<string, number>
	): MonthData[] {
		const now = new Date();
		return rawMonths.map((m) => ({
			...m,
			weeks: m.weeks.map((w) => {
				const isFuture = w > now;
				const key = w.toISOString().slice(0, 10);
				const count = isFuture ? 0 : (activityMap.get(key) ?? 0);
				const types: string[] = [];
				if (count >= 1) types.push('STAR');
				if (count >= 3) types.push('Goal');
				if (count === 4) types.push('Milestone');
				return {
					date: w,
					count,
					isFuture,
					types,
					label: w.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
				};
			})
		}));
	}

	const activityMap = $derived(new Map((weekData ?? []).map((w) => [w.weekStart, w.count])));

	const months = $derived(withCounts(groupByMonth(getLast52Weeks()), activityMap));

	const bestMonth = $derived(
		months.reduce(
			(best, m) => {
				const sum = m.weeks.reduce((s, w) => s + w.count, 0);
				return sum > best.sum ? { sum, name: m.name } : best;
			},
			{ sum: 0, name: '—' }
		)
	);

	let hovered = $state<HoveredState | null>(null);
	let tipX = $state(0);
	let tipY = $state(0);
	let cardEl = $state<HTMLDivElement | undefined>();

	function enter(e: MouseEvent | FocusEvent, week: WeekData, month: MonthData): void {
		if (week.isFuture) return;
		hovered = { week, monthName: month.fullName };
		if (cardEl && 'clientX' in e) {
			const r = cardEl.getBoundingClientRect();
			tipX = e.clientX - r.left;
			tipY = e.clientY - r.top;
		}
	}

	function leave(): void {
		hovered = null;
	}

	let tipLeft = $derived(cardEl && tipX > cardEl.offsetWidth * 0.65 ? tipX - 185 : tipX + 14);
</script>

<div class="w-full">
	<!-- Header -->
	<!-- <div class="mt-4 mb-2 flex items-end justify-between">
		<div>
			<h1
				style="font-family: 'Libre Baskerville', serif"
				class="mb-1.5 text-2xl leading-none font-bold tracking-tight text-gray-500"
			>
				Achievement Activity
			</h1>
			<p class="text-xs tracking-wide text-[#5a7a8f]">
				Last 52 weeks · darker circle = more wins that week
			</p>
		</div> -->
	<!-- <div class="text-right">
			<span class="mb-0.5 block text-[10px] tracking-widest text-[#5a7a8f] uppercase"
				>Best month</span
			>
			<span
				style="font-family: 'Libre Baskerville', serif"
				class="text-base font-bold text-[#ff7a8a]">{bestMonth.name}</span
			>
		</div> -->
	<!-- </div> -->

	<!-- Grid card -->
	<div
		bind:this={cardEl}
		class="relative rounded-2xl border border-white/6 bg-white/2 px-3 pt-4 pb-3 sm:px-5 sm:pt-5 sm:pb-4"
	>
		<!-- Month columns -->
		<div class="overflow-x-auto">
			<div class="flex items-start gap-x-2 sm:gap-x-3.5">
				{#each months as month}
					<div class="flex flex-col items-center gap-y-1 sm:gap-y-1.5">
						<span
							class="mb-0.5 text-[8px] tracking-widest whitespace-nowrap text-[#5a7a8f] uppercase select-none sm:text-[9px]"
						>
							{month.name}
						</span>

						{#each month.weeks as week}
							{@const level = getLevel(week.count)}
							{@const isHov = hovered?.week === week}
							{@const bg = week.isFuture ? 'transparent' : LEVEL_COLOR[level]}
							{@const ring = week.isFuture ? 'rgba(255,255,255,0.06)' : LEVEL_RING[level]}
							{@const glow =
								isHov && !week.isFuture && LEVEL_GLOW[level]
									? `box-shadow: 0 0 12px ${LEVEL_GLOW[level]}, 0 0 3px ${LEVEL_GLOW[level]};`
									: ''}

							<button
								class="h-4 w-4 rounded-full border transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-white/30 sm:h-6 sm:w-6"
								class:opacity-30={week.isFuture}
								class:cursor-default={week.isFuture || level === 0}
								class:cursor-pointer={!week.isFuture && level > 0}
								class:scale-125={isHov && !week.isFuture && level > 0}
								style="background: {bg}; border-color: {ring}; border-style: {week.isFuture
									? 'dashed'
									: 'solid'}; {glow}"
								onmouseenter={(e) => enter(e, week, month)}
								onmouseleave={leave}
								onfocus={(e) => enter(e, week, month)}
								onblur={leave}
								aria-label="Week of {week.label}: {week.count} achievement{week.count !== 1
									? 's'
									: ''}"
							></button>
						{/each}
					</div>
				{/each}
			</div>
		</div>

		<!-- Scale legend -->
		<div class="mt-3 flex items-center justify-end gap-1 sm:mt-4 sm:gap-1.5">
			<span class="text-[9px] tracking-widest text-[#5a7a8f] uppercase">Less</span>
			{#each [0, 1, 2, 3, 4] as l}
				<div
					class="h-3 w-3 rounded-full border sm:h-4 sm:w-4"
					style="background: {LEVEL_COLOR[l]}; border-color: {LEVEL_RING[l]};"
				></div>
			{/each}
			<span class="text-[9px] tracking-widest text-[#5a7a8f] uppercase">More</span>
		</div>

		<!-- Tooltip -->
		{#if hovered}
			{@const w = hovered.week}
			{@const level = getLevel(w.count)}
			<div
				class="bg-secondary pointer-events-none absolute z-20 rounded-xl border border-white/[0.08] px-3.5 py-2.5 shadow-2xl"
				style="left: {tipLeft}px; top: {tipY - 75}px; min-width: 155px;"
			>
				<p class="mb-1.5 text-[9px] tracking-widest text-white uppercase">
					{hovered.monthName} · wk of {w.label}
				</p>
				<p
					style="font-family: 'Libre Baskerville', serif; color: {LEVEL_COLOR[level] ===
					LEVEL_COLOR[0]
						? '#fff'
						: LEVEL_COLOR[level]}"
					class="text-[15px] leading-none font-bold"
				>
					{w.count === 0 ? 'No activity' : `${w.count} achievement${w.count > 1 ? 's' : ''}`}
				</p>
				<!-- {#if w.types?.length}
					<div class="mt-2 flex flex-wrap gap-1">
						{#each w.types as t}
							<span
								class="rounded px-1.5 py-0.5 text-[9px] font-semibold tracking-wide uppercase"
								style="background: {t === 'Milestone'
									? 'rgba(0,191,166,0.15)'
									: 'rgba(255,122,138,0.12)'}; color: {t === 'Milestone' ? '#00bfa6' : '#ff7a8a'};"
								>{t}</span
							>
						{/each}
					</div>
				{/if} -->
			</div>
		{/if}
	</div>
</div>
