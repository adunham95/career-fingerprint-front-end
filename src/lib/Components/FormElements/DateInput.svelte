<script lang="ts">
	import Label, { type LabelProps } from './Label.svelte';

	interface DatePickerProps extends LabelProps {
		value: string | null;
		minYear?: number;
		maxYear?: number;
		showDate?: boolean;
	}

	let {
		value = $bindable(null),
		minYear = 1900,
		maxYear = 2100,
		id,
		label,
		showDate = false
	}: DatePickerProps = $props();

	const parseDate = (dateStr: string | null): Date => {
		if (!dateStr || dateStr === '') return new Date();
		const parsed = new Date(dateStr);
		return isNaN(parsed.getTime()) ? new Date() : parsed;
	};

	const formatDate = (year: number, month: number, date: number = 1): string => {
		const monthStr = String(month + 1).padStart(2, '0');
		return `${year}-${monthStr}-${date}`;
	};

	// Parse initial value
	const initialDate: Date = parseDate(value);

	// Reactive state using runes
	let selectedMonth: number = $state(initialDate.getMonth());
	let selectedYear: number = $state(initialDate.getFullYear());
	let selectedDay: number = $state(initialDate.getDay());

	// Month names
	const months: string[] = [
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

	// Generate year options
	const years: number[] = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

	const daysInMonth = $derived((): number => {
		return new Date(selectedYear, selectedMonth + 1, 0).getDate();
	});

	const days = $derived((): number[] => {
		return Array.from({ length: daysInMonth() }, (_, i) => i + 1);
	});

	// Update the bound value when selections change (separate effect tracking only selections)
	$effect(() => {
		// Update the bound value as date string
		const newValue = formatDate(selectedYear, selectedMonth, selectedDay);
		if (newValue !== value) {
			value = newValue;
		}
	});

	$inspect({ selectedMonth, selectedYear, selectedDay });
</script>

<div>
	<Label {id} {label} />
	<div class="container grid grid-cols-5 gap-2">
		<div class={`${showDate ? 'col-span-2' : 'col-span-3'} flex flex-col gap-1`}>
			<label for={'month-select' + id} class="text-sm font-medium text-gray-700">Month</label>
			<select
				id={'month-select' + id}
				bind:value={selectedMonth}
				class="cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			>
				{#each months as month, index}
					<option value={index}>{month}</option>
				{/each}
			</select>
		</div>

		{#if showDate}
			<div class="col-span-1 flex flex-col gap-1">
				<label for={'date-select' + id} class="text-sm font-medium text-gray-700">Day</label>
				<select
					id={'date-select' + id}
					bind:value={selectedDay}
					class="cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
				>
					{#each days() as day, index}
						<option value={index}>{day}</option>
					{/each}
				</select>
			</div>
		{/if}

		<div class="col-span-2 flex flex-col gap-1">
			<label for={'year-select' + id} class="text-sm font-medium text-gray-700">Year</label>
			<select
				id={'year-select' + id}
				bind:value={selectedYear}
				class=" cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			>
				{#each years as year}
					<option value={year}>{year}</option>
				{/each}
			</select>
		</div>
	</div>
</div>
