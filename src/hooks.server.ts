import { sequence } from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import type { Handle } from '@sveltejs/kit';
import { PUBLIC_SENTRY_DSN } from '$env/static/public';
import type { CurrentUser } from './app';
import { createApiClient } from '$lib/API/apiClient';

Sentry.init({
	dsn: PUBLIC_SENTRY_DSN,
	tracesSampleRate: 1,
	enableLogs: true
});

const blacklistedPaths = ['/wp-admin/setup-config.php', '/wordpress/wp-admin/setup-config.php'];

export const handle: Handle = sequence(Sentry.sentryHandle(), async ({ event, resolve }) => {
	const path = event.url.pathname;
	const ip = event.getClientAddress();

	if (
		blacklistedPaths.includes(path) ||
		path.endsWith('.php') ||
		path.startsWith('/wp-') ||
		path.startsWith('/wordpress')
	) {
		console.warn(`Blocked bot at ${ip} trying to access ${path}`);
		return new Response('Forbidden', { status: 403 });
	}

	let user: CurrentUser | null = null;
	const api = createApiClient(event);
	try {
		user = await api.get('/auth/current-user');
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (err: any) {
		if (err.message.includes('401')) {
			// Retry handled inside api client with refresh
			try {
				user = await api.get('/auth/current-user');
			} catch {
				user = null;
			}
		} else {
			console.error('Auth check failed', err);
		}
	}
	event.locals.user = user;

	const response = await resolve(event);

	// If your API client got a new cookie during refresh:
	if (event.locals.newCookie) {
		response.headers.append('set-cookie', event.locals.newCookie);
	}

	return response;
});
export const handleError = Sentry.handleErrorWithSentry();
