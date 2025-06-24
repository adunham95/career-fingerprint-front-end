export function generateId(length: number): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';

	for (let i = 0; i < length; i++) {
		const randIndex = Math.floor(Math.random() * chars.length);
		result += chars[randIndex];
	}

	return result;
}
