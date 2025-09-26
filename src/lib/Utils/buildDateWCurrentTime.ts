export function buildDateWithCurrentTime(year: string, month: string, day?: string): Date {
	const now = new Date();

	// JS months are 0-based, so subtract 1 from month
	const newDate = new Date(
		parseInt(year),
		parseInt(month),
		day ? parseInt(day) : now.getDate(),
		now.getHours(),
		now.getMinutes(),
		now.getSeconds(),
		now.getMilliseconds()
	);

	return newDate;
}
