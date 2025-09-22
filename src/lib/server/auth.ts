import { createApiClient } from '$lib/API/apiClient';
import type { RequestEvent } from '@sveltejs/kit';
import type { CurrentUser } from '../../app';

export async function loadUser(event: RequestEvent): Promise<CurrentUser | null> {
	if (event.locals.user) return event.locals.user;

	const token = event.locals.tokens?.accessToken;
	if (!token) return null;

	try {
		const api = createApiClient(event);
		const user = await api.get('/auth/current-user');
		event.locals.user = user as CurrentUser;
		return event.locals.user;
	} catch {
		return null;
	}
}
