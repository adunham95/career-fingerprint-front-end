export function centsToDollars(cents: number): string {
	const dollars = cents / 100;
	return dollars.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
