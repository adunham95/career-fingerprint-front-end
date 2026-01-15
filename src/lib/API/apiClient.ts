import { PUBLIC_API_URL } from '$env/static/public';
import type { ApiErrorResponse } from '../../app';

export class ApiError extends Error {
	statusCode: number;
	code?: string;
	rawMessage: string | string[];

	constructor(data: ApiErrorResponse) {
		const message = Array.isArray(data.message) ? data.message.join(', ') : data.message;

		super(message);

		this.name = 'ApiError';
		this.statusCode = data.statusCode;
		this.code = data.code;
		this.rawMessage = data.message;
	}
}

function buildQuery(params?: Record<string, string | number | boolean | undefined>) {
	if (!params) return '';
	const query = Object.entries(params)
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		.filter(([_, v]) => v !== undefined)
		.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
		.join('&');
	return query ? `?${query}` : '';
}

export interface ApiClient {
	get<T>(
		path: string,
		params?: Record<string, string | number | boolean | undefined>,
		options?: RequestInit
	): Promise<T>;

	post<T>(path: string, body?: unknown, options?: RequestInit): Promise<T>;

	patch<T>(path: string, body?: unknown, options?: RequestInit): Promise<T>;

	del<T>(path: string, options?: RequestInit): Promise<T>;
}

export interface ApiEventInput {
	request: Request;
}

export function createApiClient(event?: ApiEventInput) {
	async function request<T>(
		method: string,
		path: string,
		body?: unknown,
		options: RequestInit = {},
		params?: Record<string, string | number | boolean | undefined>
	): Promise<T> {
		let headers: HeadersInit = options.headers || {};

		if (body && !(body instanceof FormData)) {
			headers = { ...headers, 'Content-Type': 'application/json' };
		}

		// Forward cookies if we’re in a server load
		if (event) {
			const cookieHeader = event.request.headers.get('cookie');
			if (cookieHeader) {
				headers = { ...headers, cookie: cookieHeader };
			}
		} else {
			// Client-side, let browser attach cookies
			options.credentials = 'include';
		}

		const res = await fetch(`${PUBLIC_API_URL}${path}${buildQuery(params)}`, {
			...options,
			method,
			headers,
			body: body ? JSON.stringify(body) : undefined
		});

		if (!res.ok) {
			let errorData: ApiErrorResponse;

			try {
				errorData = (await res.json()) as ApiErrorResponse;
			} catch {
				errorData = {
					statusCode: res.status,
					message: await res.text()
				};
			}

			console.log({ errorData });

			throw new ApiError(errorData);
		}

		// Try parsing JSON, but allow empty body
		const text = await res.text();
		return text ? (JSON.parse(text) as T) : (undefined as T);
	}

	return {
		get: <T>(
			path: string,
			params?: Record<string, string | number | boolean | undefined>,
			options?: RequestInit
		) => request<T>('GET', path, undefined, options, params),
		post: <T>(path: string, body?: unknown, options?: RequestInit) =>
			request<T>('POST', path, body, options),
		patch: <T>(path: string, body?: unknown, options?: RequestInit) =>
			request<T>('PATCH', path, body, options),
		del: <T>(path: string, options?: RequestInit) => request<T>('DELETE', path, undefined, options)
	};
}
