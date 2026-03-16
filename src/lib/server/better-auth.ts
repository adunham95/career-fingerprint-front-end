import { createApiClient } from '$lib/API/apiClient';
import type { RequestEvent } from '@sveltejs/kit';
import type { CurrentUser } from '../../app';
import { loadUser } from './auth';

/**
 * Drop-in replacement for loadUser() that checks for a Better Auth session
 * cookie first, then falls back to the legacy accessToken/sessionAccessToken
 * pair via loadUser().
 *
 * The backend BetterAuthGuard handles validation for both session types on the
 * /auth/current-user endpoint, so we only need to decide whether to make the
 * request at all.
 *
 * Route-by-route migration plan (Phase 5):
 *   1. Swap loadUser() for loadUserFromSession() in a layout or page
 *   2. Confirm it works in staging with both old and new session cookies
 *   3. Once all routes are cut over, delete loadUser() and this fallback
 */
export async function loadUserFromSession(event: RequestEvent): Promise<CurrentUser | null> {
	console.log('eventUser', event.locals.user);
	if (event.locals.user) return event.locals.user;

	const hasBaSession = !!event.cookies.get('cf.session_token');
	const hasLegacySession =
		!!event.cookies.get('sessionAccessToken') || !!event.locals.tokens?.accessToken;

	console.log(
		'hasBaSession:',
		hasBaSession,
		'hasLegacySession',
		hasLegacySession,
		'missingSession:',
		!hasBaSession && !hasLegacySession
	);

	if (!hasBaSession && !hasLegacySession) return null;

	if (hasBaSession) {
		try {
			const api = createApiClient(event);
			const user = await api.get<CurrentUser>('/auth/current-user');
			console.log('current-user', user);
			event.locals.user = user;
			return user;
		} catch {
			// BA session invalid or expired — fall through to legacy
		}
	}

	return loadUser(event);
}
