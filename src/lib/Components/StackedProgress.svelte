<script lang="ts">
	type Segment = {
		id?: string;
		label?: string;

		currentValue: number;
		totalValue: number;
		color: string;
	};

	interface Props {
		segments: Segment[];
		heightClass?: string;
		roundedClass?: string;
		backgroundClass?: string;
	}

	const {
		segments,
		heightClass = 'h-2',
		roundedClass = 'rounded-full',
		backgroundClass = 'bg-gray-200'
	}: Props = $props();

	function clamp(n: number, min: number, max: number) {
		return Math.max(min, Math.min(max, n));
	}

	const computed = $derived.by(() => {
		// 🔑 total work across all goals
		const totalTarget = segments.reduce((sum, s) => sum + Math.max(0, s.totalValue), 0);

		if (totalTarget === 0) return [];

		return segments
			.map((s) => {
				const pct = (s.currentValue / totalTarget) * 100;

				return {
					...s,
					pct: clamp(pct, 0, 100)
				};
			})
			.filter((s) => s.pct > 0);
	});
</script>

<div class={`overflow-hidden ${roundedClass} ${backgroundClass}`}>
	<div class={`flex w-full ${heightClass}`}>
		{#each computed as s, i (s.id ?? i)}
			<div
				class={`h-full ${roundedClass}`}
				style={`width:${s.pct}%;background:${s.color}`}
				title={s.label ?? `${s.currentValue}/${s.totalValue}`}
			></div>
		{/each}
	</div>
</div>
