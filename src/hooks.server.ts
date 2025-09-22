import { sequence } from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import type { Handle } from '@sveltejs/kit';
import { PUBLIC_SENTRY_DSN } from '$env/static/public';

if (process.env.NODE_ENV === 'production') {
	Sentry.init({
		dsn: PUBLIC_SENTRY_DSN,
		tracesSampleRate: 1,
		enableLogs: false
	});
}
const blacklistedPaths = ['/wp-admin/setup-config.php', '/wordpress/wp-admin/setup-config.php'];
const botPatterns = [/\.php$/, /^\/wp-/, /^\/wordpress/];

export const handle: Handle = sequence(Sentry.sentryHandle(), async ({ event, resolve }) => {
	const path = event.url.pathname;
	const ip = event.getClientAddress();

	if (blacklistedPaths.includes(path) || botPatterns.some((p) => p.test(path))) {
		console.warn(`Blocked bot at ${ip} trying to access ${path}`);
		return new Response('Forbidden', { status: 403 });
	}

	const accessToken = event.cookies.get('accessToken');
	event.locals.tokens = { accessToken };
	event.locals.user = null; // not fetched yet

	return resolve(event);
});
export const handleError = Sentry.handleErrorWithSentry();
