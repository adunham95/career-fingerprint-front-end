import { createApiClient } from '$lib/API/apiClient.js';
import { PUBLIC_API_URL } from '$env/static/public';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	// Sign out of Better Auth session (deletes ba_session row server-side)
	const hasBaSession = !!event.cookies.get('cf.session_token');
	if (hasBaSession) {
		await fetch(`${PUBLIC_API_URL}/api/auth/sign-out`, {
			method: 'POST',
			headers: { cookie: event.request.headers.get('cookie') ?? '' }
		}).catch(() => null);
		event.cookies.delete('cf.session_token', { path: '/' });
	}

	// Sign out of legacy Redis session
	const api = createApiClient(event);
	await api.get('/auth/logout').catch(() => null);
	event.cookies.delete('accessToken', { path: '/' });
	event.cookies.delete('sessionAccessToken', { path: '/' });

	event.locals.user = null;
	redirect(303, '/login');
};
