export function getMonthName(monthNumber: number): string {
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

	if (monthNumber < 1 || monthNumber > 12) {
		throw new Error('Month number must be between 1 and 12');
	}

	return months[monthNumber];
}

export function formatDate(dateString?: string | null) {
	if (!dateString) {
		return '';
	}
	const date = new Date(dateString);

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

	return `${months[date.getMonth()]} ${date.getFullYear()}`;
}
