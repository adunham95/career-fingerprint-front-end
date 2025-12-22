import type { ApiErrorResponse } from '../../app';

export function isApiError(error: unknown): error is { response: { data: ApiErrorResponse } } {
	return (
		typeof error === 'object' &&
		error !== null &&
		'response' in error &&
		typeof (error as any).response?.data?.message !== 'undefined'
	);
}
