import { sequence } from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import type { Handle } from '@sveltejs/kit';
import { PUBLIC_SENTRY_DSN } from '$env/static/public';
import { createApiClient } from '$lib/API/apiClient';
import type { CurrentUser } from './app';

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

	const authToken = event.cookies.get('accessToken');
	const sessionToken = event.cookies.get('sessionAccessToken');
	console.log({ sessionToken });
	if (!authToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const api = createApiClient(event);

	const user = await api.get('/auth/current-user');

	event.locals.user = user as CurrentUser;

	return resolve(event);
});
export const handleError = Sentry.handleErrorWithSentry();
