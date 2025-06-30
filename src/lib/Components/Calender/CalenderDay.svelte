<script lang="ts">
	interface IDay {
		day: number;
		year: number;
		month: number;
	}

	interface Props {
		thisDay: IDay;
		selectedDay?: IDay;
		disableIfSelected?: boolean;
		disabled?: boolean;
	}

	const today = {
		day: new Date().getDay(),
		month: new Date().getMonth(),
		year: new Date().getFullYear()
	};

	let {
		thisDay,
		disabled = false,
		selectedDay = $bindable({ month: 0, day: 0, year: 0 })
	}: Props = $props();

	function onDayClick(day: number, month: number, year: number) {
		selectedDay = { month, day, year };
	}

	function isToday() {
		if (thisDay.year !== today.year) return false;
		if (thisDay.month !== today.month) return false;
		if (thisDay.day !== today.day) return false;
		return true;
	}

	function getStyle() {
		if (thisDay.month === selectedDay.month) {
			return 'bg-white text-gray-500 has-[:checked]:bg-primary-200 has-[:checked]:text-primary-600 has-[:checked]:font-semibold hover:bg-primary-100';
		}
		return 'bg-gray-50 text-gray-400 hover:bg-gray-100 has-[:checked]:bg-primary-100 has-[:checked]:text-primary-500 has-[:checked]:font-semibold';
	}
</script>

<label
	class={` py-1.5 focus:z-10 has-[:checked]:bg-primary/10 has-[:checked]:text-primary has-[:checked]:font-semibold has-[:disabled]:bg-gray-200 ${getStyle()}`}
>
	<input
		hidden
		onchange={() => onDayClick(thisDay.day, thisDay.month, thisDay.year)}
		type="radio"
		name="calender"
		class="hidden"
		checked={thisDay.day === selectedDay.day && thisDay.month === selectedDay.month}
		{disabled}
	/>
	<time
		datetime={`${thisDay.year}-${thisDay.month}-${thisDay.day}`}
		class={`mx-auto flex h-7 w-7 items-center justify-center rounded-full ${isToday() && 'rounded-full text-primary font-semibold'}`}
		>{thisDay.day}</time
	>
</label>
