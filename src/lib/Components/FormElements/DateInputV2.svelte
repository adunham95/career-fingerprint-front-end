<script lang="ts">
	interface Props {
		value: string | null;
		dayOptional?: boolean;
	}
	let { value = $bindable(null), dayOptional }: Props = $props();
	// export let value: string | null = $bindable(null); // incoming value
	// export let dayOptional: boolean = true;

	// Internal state
	let month = $state<number | null>(null);
	let day = $state<number | null>(null);
	let year = $state<number | null>(null);

	const months = [
		{ value: 1, label: 'January' },
		{ value: 2, label: 'February' },
		{ value: 3, label: 'March' },
		{ value: 4, label: 'April' },
		{ value: 5, label: 'May' },
		{ value: 6, label: 'June' },
		{ value: 7, label: 'July' },
		{ value: 8, label: 'August' },
		{ value: 9, label: 'September' },
		{ value: 10, label: 'October' },
		{ value: 11, label: 'November' },
		{ value: 12, label: 'December' }
	];

	const currentYear = new Date().getFullYear();
	const years: number[] = Array.from({ length: 110 }, (_, i) => currentYear + 10 - i);

	// --- Effect 1: External value -> internal state ---
	$effect(() => {
		const v = value; // read so effect reacts to external changes
		if (!v) {
			month = null;
			day = null;
			year = null;
			return;
		}

		const parts = v.split('-');
		const y = parseInt(parts[0]);
		const m = parts[1] ? parseInt(parts[1]) : null;
		const d = parts[2] ? parseInt(parts[2]) : null;

		if (year !== y) year = y;
		if (month !== m) month = m;
		if (day !== d) day = d;
	});

	// --- Days in month ---
	const daysInMonth = $derived(() => (year && month ? new Date(year, month, 0).getDate() : 31));
	const days = $derived(() => Array.from({ length: daysInMonth() }, (_, i) => i + 1));

	// --- Effect 2: Internal state -> value ---
	$effect(() => {
		// don't emit if year/month not selected
		if (!year || !month) {
			value = null;
			return;
		}

		// build new date string
		let newValue: string;
		if (dayOptional && !day) {
			newValue = `${year}-${String(month).padStart(2, '0')}`;
		} else if (day) {
			newValue = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
		} else {
			newValue = `${year}-${String(month).padStart(2, '0')}-01`;
		}

		if (newValue !== value) value = newValue;
	});

	// clamp day if month changes
	$effect(() => {
		if (day && day > daysInMonth()) day = daysInMonth();
	});
</script>

<div class="flex gap-2">
	<select bind:value={month}>
		<option value={null}>Month</option>
		{#each months as m}
			<option value={m.value}>{m.label}</option>
		{/each}
	</select>

	{#if !dayOptional || (month && year)}
		<select bind:value={day}>
			<option value={null}>Day</option>
			{#each days() as d}
				<option value={d}>{d}</option>
			{/each}
		</select>
	{/if}

	<select bind:value={year}>
		<option value={null}>Year</option>
		{#each years as y}
			<option value={y}>{y}</option>
		{/each}
	</select>
</div>
