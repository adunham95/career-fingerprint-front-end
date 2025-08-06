import {sequence} from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import type { Handle } from '@sveltejs/kit';
import * as auth from '$lib/Server/auth';

Sentry.init({
    dsn: "https://33aa3e5181ec848a1716968ca1bc34fd@o4509797399265280.ingest.us.sentry.io/4509797400576000",
    tracesSampleRate: 1,
    enableLogs: true
})

export const handle: Handle = sequence(Sentry.sentryHandle(), async ({ event, resolve }) => {
	const authToken = event.cookies.get('accessToken');
	if (!authToken) {
		event.locals.user = null;
		// event.locals.session = null;
		return resolve(event);
	}

	const { user } = await auth.validateAuthToken(authToken);
	// if (session) {
	// 	auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	// } else {
	// 	auth.deleteSessionTokenCookie(event);
	// }

	event.locals.user = user;

	return resolve(event);
});
export const handleError = Sentry.handleErrorWithSentry();