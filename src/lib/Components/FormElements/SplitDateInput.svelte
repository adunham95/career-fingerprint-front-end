<script lang="ts">
	import type { LabelProps } from './Label.svelte';
	import Label from './Label.svelte';

	interface Props extends LabelProps {
		month: string;
		day: string;
		year: string;
		showDate?: boolean;
	}

	let {
		id,
		label,
		month = $bindable(''),
		day = $bindable(''),
		year = $bindable(''),
		showDate
	}: Props = $props();

	console.log({ month, day, year });

	// Lists for dropdowns
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

	const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
	const years = Array.from({ length: 100 }, (_, i) => String(new Date().getFullYear() - i));
</script>

<div>
	<Label {id} {label} />
	<div class="container grid grid-cols-5 gap-2">
		<!-- Month -->
		<div class={`${showDate ? 'col-span-2' : 'col-span-3'} flex flex-col gap-1`}>
			<label for={'month-select' + id} class="text-sm font-medium text-gray-700">Month</label>
			<select
				bind:value={month}
				id={'month-select' + id}
				class="cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			>
				<option value="">Month</option>
				{#each months as m, i}
					<option value={i.toString()}>{m}</option>
				{/each}
			</select>
		</div>

		<!-- Day (optional) -->
		{#if showDate}
			<div class="col-span-1 flex flex-col gap-1">
				<label for={'date-select' + id} class="text-sm font-medium text-gray-700">Day</label>
				<select
					id={'date-select' + id}
					bind:value={day}
					class="cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
				>
					<option value="">Day</option>
					{#each days as d}
						<option value={d}>{d}</option>
					{/each}
				</select>
			</div>
		{/if}

		<!-- Year -->
		<div class="col-span-2 flex flex-col gap-1">
			<label for={'year-select' + id} class="text-sm font-medium text-gray-700">Year</label>
			<select
				id={'year-select' + id}
				bind:value={year}
				class=" cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			>
				<option value="">Year</option>
				{#each years as y}
					<option value={y}>{y}</option>
				{/each}
			</select>
		</div>
	</div>
</div>
