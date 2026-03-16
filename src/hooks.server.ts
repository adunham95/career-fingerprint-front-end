import { sequence } from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import type { Handle } from '@sveltejs/kit';
import { PUBLIC_SENTRY_DSN } from '$env/static/public';

if (process.env.NODE_ENV === 'production' && PUBLIC_SENTRY_DSN) {
	Sentry.init({
		dsn: PUBLIC_SENTRY_DSN,
		tracesSampleRate: 0.1,
		enableLogs: false
	});
}
const blacklistedPaths = ['/wp-admin/setup-config.php', '/wordpress/wp-admin/setup-config.php'];
const botPatterns = [/\.php$/, /^\/wp-/, /^\/wordpress/];

export const handle: Handle = sequence(Sentry.sentryHandle(), async ({ event, resolve }) => {
	const path = event.url.pathname;

	if (blacklistedPaths.includes(path) || botPatterns.some((p) => p.test(path))) {
		const ip = event.getClientAddress();
		console.warn(`Blocked bot at ${ip} trying to access ${path}`);
		return new Response('Forbidden', { status: 403 });
	}

	const token = event.url.searchParams.get('token');
	if (token) {
		event.cookies.set('accessToken', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
			maxAge: 60 * 60 * 24 * 7, // 7 days
			path: '/',
			// optional if both api + app share root domain:
			domain: process.env.COOKIE_DOMAIN
		});
		event.locals.tokens = { accessToken: token };
		event.locals.session = event.cookies.get('sessionAccessToken') ?? null;
		event.locals.user = null; // not fetched yet

		// Optionally redirect user cleanly without token in URL
		return resolve(event);
	}

	const accessToken = event.cookies.get('accessToken');
	const session = event.cookies.get('sessionAccessToken') ?? null;
	const baSession = event.cookies.get('cf.session_token') ?? null;
	event.locals.tokens = { accessToken };
	event.locals.session = session;
	event.locals.baSession = baSession;
	event.locals.user = null; // not fetched yet

	return resolve(event);
});
export const handleError = Sentry.handleErrorWithSentry();
