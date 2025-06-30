export const monthNames = [
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

export function getMonthName(monthIndex: number) {
	return monthNames[monthIndex];
}

export function daysInMonth(iMonth: number, iYear: number) {
	return new Date(iYear, iMonth, 0).getDate();
}

export function getPrevMonth(month: number, year: number) {
	let prevMonth = month - 1,
		prevYear = year;
	if (month - 1 < 0) {
		prevMonth = 11;
		prevYear = year - 1;
	}

	return { prevMonth, prevYear };
}

export function getNextMonth(month: number, year: number) {
	let nextMonth = month + 1,
		nextYear = year;
	if (month - 1 < 0) {
		nextMonth = 11;
		nextYear = year - 1;
	}

	return { nextMonth, nextYear };
}

interface IBuildMonthArrayOptions {
	useArrayMonth: boolean;
}

const defaultBuildMonthArrayOptions = {
	useArrayMonth: true
};

export function buildMonthArray(
	iMonth: number,
	iYear: number,
	options: IBuildMonthArrayOptions = defaultBuildMonthArrayOptions
) {
	const tableArr = [];

	const firstDay = new Date(iYear, iMonth).getDay();
	const beforeAfter = {
		...getPrevMonth(iMonth, iYear),
		...getNextMonth(iMonth, iYear)
	};

	// creating all cells
	let date = 1;
	let nextMonth = false;
	for (let i = 0; i < 6; i++) {
		// creates a table row
		// const row = document.createElement('tr');
		// const tableArr = [];

		//creating individual cells, filing them up with data.
		for (let j = 0; j < 7; j++) {
			if (i === 0 && j < firstDay) {
				const day = daysInMonth(beforeAfter.prevMonth, beforeAfter.prevYear) - (firstDay - (j + 2));
				tableArr.push({
					month: beforeAfter.prevMonth + (options.useArrayMonth ? 0 : 1),
					year: beforeAfter.prevYear,
					day
				});
			} else if (date > daysInMonth(iMonth, iYear)) {
				tableArr.push({
					year: beforeAfter.nextYear,
					month: beforeAfter.nextMonth + (options.useArrayMonth ? 0 : 1),
					day: 1
				});
				date = 2;
				nextMonth = true;
			} else {
				if (nextMonth) {
					tableArr.push({
						year: beforeAfter.nextYear,
						month: beforeAfter.nextMonth + (options.useArrayMonth ? 0 : 1),
						day: date
					});
				} else {
					tableArr.push({
						year: iYear,
						month: iMonth + (options.useArrayMonth ? 0 : 1),
						day: date
					});
				}
				date++;
			}
		}

		if (nextMonth) {
			break;
		}
	}

	return tableArr;
}

export function generateCalendarCellsWithAdjacentDays(month: number, year: number) {
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const firstDayOfWeek = new Date(year, month, 1).getDay();

	const calendarCells = [];

	// Get the previous month and its year, handling the year boundary
	const prevMonth = month === 0 ? 11 : month - 1;
	const prevMonthYear = month === 0 ? year - 1 : year;
	const daysInPreviousMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate();

	// Add days from the previous month
	for (let i = firstDayOfWeek - 1; i >= 0; i--) {
		calendarCells.push({ day: daysInPreviousMonth - i, month: prevMonth, year: prevMonthYear });
	}

	// Add days from the current month
	for (let day = 1; day <= daysInMonth; day++) {
		calendarCells.push({ day: day, month: month, year: year });
	}

	// Get the next month and its year, handling the year boundary
	const nextMonth = month === 11 ? 0 : month + 1;
	const nextMonthYear = month === 11 ? year + 1 : year;

	// Add days from the next month to complete the final week
	let nextMonthDay = 1;
	while (calendarCells.length % 7 !== 0) {
		calendarCells.push({ day: nextMonthDay++, month: nextMonth, year: nextMonthYear });
	}

	return calendarCells;
}
