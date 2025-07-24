import type { Handle } from '@sveltejs/kit';
import * as auth from '$lib/Server/auth';

export const handle: Handle = async ({ event, resolve }) => {
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
};
