<script lang="ts">
	import Label, { type LabelProps } from './Label.svelte';
	import { onMount } from 'svelte';

	interface DatePickerProps extends LabelProps {
		value: string | null; // ✅ controlled prop
		onChange?: (value: string) => void; // ✅ Svelte 5 callback prop
		minYear?: number;
		maxYear?: number;
		showDate?: boolean;
	}

	let {
		value = null,
		onChange,
		minYear = 1900,
		maxYear = 2100,
		id,
		label,
		showDate = false
	}: DatePickerProps = $props();

	/* -------------------------------------------------------
	   Helpers
	------------------------------------------------------- */
	const parseDate = (dateStr: string | null): Date => {
		if (!dateStr) return new Date();
		const d = new Date(dateStr);
		return isNaN(d.getTime()) ? new Date() : d;
	};

	const formatDate = (y: number, m: number, d: number = 1): string => {
		return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
	};

	/* -------------------------------------------------------
	   Local Component State
	------------------------------------------------------- */
	let selectedYear = $state(2000);
	let selectedMonth = $state(0);
	let selectedDay = $state(1);

	// Initialize once (so parent->child updates don’t loop)
	onMount(() => {
		const d = parseDate(value);
		selectedYear = d.getFullYear();
		selectedMonth = d.getMonth();
		selectedDay = d.getDate();
	});

	/* -------------------------------------------------------
	   Derived Values
	------------------------------------------------------- */
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

	// ✅ Pure reactive values using $derived
	const daysInMonth = $derived(() => new Date(selectedYear, selectedMonth + 1, 0).getDate());

	const days = $derived(() => Array.from({ length: daysInMonth() }, (_, i) => i + 1));

	/* -------------------------------------------------------
	   Controlled-change callback
	------------------------------------------------------- */
	const emitChange = () => {
		// clamp invalid day
		if (selectedDay > daysInMonth()) {
			selectedDay = daysInMonth();
		}

		const newValue = formatDate(selectedYear, selectedMonth, selectedDay);

		// ✅ Svelte 5 callback pattern
		onChange?.(newValue);
	};
</script>

<div>
	<Label {id} {label} />

	<div class="container grid grid-cols-5 gap-2">
		<!-- Month -->
		<div class={`${showDate ? 'col-span-2' : 'col-span-3'} flex flex-col gap-1`}>
			<label for={'month-' + id} class="text-sm font-medium text-gray-700">Month</label>
			<select
				id={'month-' + id}
				bind:value={selectedMonth}
				onchange={emitChange}
				class="cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
			>
				{#each months as m, index}
					<option value={index}>{m}</option>
				{/each}
			</select>
		</div>

		<!-- Day -->
		{#if showDate}
			<div class="col-span-1 flex flex-col gap-1">
				<label for={'day-' + id} class="text-sm font-medium text-gray-700">Day</label>
				<select
					id={'day-' + id}
					bind:value={selectedDay}
					onchange={emitChange}
					class="cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
				>
					{#each days() as day}
						<option value={day}>{day}</option>
					{/each}
				</select>
			</div>
		{/if}

		<!-- Year -->
		<div class="col-span-2 flex flex-col gap-1">
			<label for={'year-' + id} class="text-sm font-medium text-gray-700">Year</label>
			<select
				id={'year-' + id}
				bind:value={selectedYear}
				onchange={emitChange}
				class="cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
			>
				{#each years as y}
					<option value={y}>{y}</option>
				{/each}
			</select>
		</div>
	</div>
</div>
