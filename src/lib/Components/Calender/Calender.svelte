<script lang="ts">
	import { generateCalendarCellsWithAdjacentDays, monthNames } from '$lib/Utils/generateCalender';
	import CalenderDay from './CalenderDay.svelte';

	interface Props {
		disableClicks?: boolean;
		disableSelectedDays?: boolean;
		startDate?: { month: number; day: number; year: number };
		selectedDay?: { month: number; day: number; year: number };
	}

	let {
		startDate = { month: 0, day: 0, year: 0 },
		disableSelectedDays = false,
		selectedDay = $bindable({
			month: new Date().getMonth(),
			day: new Date().getDay(),
			year: new Date().getFullYear()
		})
	}: Props = $props();

	const dayArray = $derived(
		generateCalendarCellsWithAdjacentDays(selectedDay.month, selectedDay.year)
	);

	$inspect(selectedDay);
	function goToMonth(type: 'up' | 'down') {
		let nextMonth = selectedDay.month;
		let nextYear = selectedDay.year;
		if (type === 'down') {
			if (nextMonth === 0) {
				nextYear -= 1;
				nextMonth = 11;
			} else {
				nextMonth -= 1;
			}
		}
		if (type === 'up') {
			if (nextMonth === 11) {
				nextYear += 1;
				nextMonth = 0;
			} else {
				nextMonth += 1;
			}
		}
		selectedDay = { month: nextMonth, year: nextYear, day: 1 };
	}

	function isDisabled(m: number, d: number, y: number) {
		const { day: startDay, month: startMonth, year: startYear } = startDate;
		if (y < startYear) return true;
		if (m < startMonth) return true;
		if (m === startMonth && d < startDay) return true;
		return false;
	}
</script>

<div>
	<div class="text-center">
		<div class="flex items-center text-gray-900">
			<button
				type="button"
				onclick={() => goToMonth('down')}
				class="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
			>
				<span class="sr-only">Previous month</span>
				<svg
					class="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
					data-slot="icon"
				>
					<path
						fill-rule="evenodd"
						d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
			<div class="flex-auto text-sm font-semibold">
				{monthNames[selectedDay.month]}
				{selectedDay.year}
			</div>
			<button
				type="button"
				onclick={() => goToMonth('up')}
				class="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
			>
				<span class="sr-only">Next month</span>
				<svg
					class="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
					data-slot="icon"
				>
					<path
						fill-rule="evenodd"
						d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		</div>
	</div>

	<div class="mt-10 text-center">
		<div class="mt-6 grid grid-cols-7 text-xs leading-6 text-gray-500">
			<div>S</div>
			<div>M</div>
			<div>T</div>
			<div>W</div>
			<div>T</div>
			<div>F</div>
			<div>S</div>
		</div>

		<div
			class="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200"
		>
			{#each dayArray as days}
				<CalenderDay
					disableIfSelected={disableSelectedDays}
					bind:selectedDay
					thisDay={days}
					disabled={isDisabled(days.month, days.day, days.year)}
				/>
			{/each}
		</div>
	</div>
</div>
