import { PUBLIC_API_URL } from '$env/static/public';

export function createApiClient(event?: { request: Request }) {
	async function request<T>(
		method: string,
		path: string,
		body?: unknown,
		options: RequestInit = {}
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

		const res = await fetch(`${PUBLIC_API_URL}${path}`, {
			...options,
			method,
			headers,
			body: body ? JSON.stringify(body) : undefined
		});

		if (!res.ok) {
			const text = await res.text();
			throw new Error(`API error ${res.status}: ${text}`);
		}

		// Try parsing JSON, but allow empty body
		const text = await res.text();
		return text ? (JSON.parse(text) as T) : (undefined as T);
	}

	return {
		get: <T>(path: string, options?: RequestInit) => request<T>('GET', path, undefined, options),
		post: <T>(path: string, body?: unknown, options?: RequestInit) =>
			request<T>('POST', path, body, options),
		patch: <T>(path: string, body?: unknown, options?: RequestInit) =>
			request<T>('PATCH', path, body, options),
		del: <T>(path: string, options?: RequestInit) => request<T>('DELETE', path, undefined, options)
	};
}
