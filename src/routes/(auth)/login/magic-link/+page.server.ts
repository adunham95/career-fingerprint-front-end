import { redirect } from '@sveltejs/kit';
import { PUBLIC_API_URL } from '$env/static/public';
import type { CurrentUser } from '../../../../app.js';

export const load = async (event) => {
	const token = event.url.searchParams.get('token');
	const callbackURL = event.url.searchParams.get('callbackURL') ?? '/dashboard';

	if (!token) {
		redirect(302, '/login');
	}

	const result = await fetch(
		`${PUBLIC_API_URL}/login-token/magic-link/exchange/${token}`
	).then(
		(r) =>
			r.json() as Promise<{
				tokenValid: boolean;
				signedToken?: string;
				cookieName?: string;
			}>
	);

	if (!result.tokenValid || !result.signedToken || !result.cookieName) {
		redirect(302, '/login');
	}

	const isProd = process.env.NODE_ENV === 'production';
	event.cookies.set(result.cookieName, result.signedToken, {
		httpOnly: true,
		secure: isProd,
		sameSite: isProd ? 'none' : 'lax',
		maxAge: 60 * 60 * 24 * 7,
		path: '/',
		...(isProd && process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {})
	});

	// Fetch the user with the new session cookie included so we can identify them client-side
	let user: CurrentUser | null = null;
	try {
		const existingCookies = event.request.headers.get('cookie') ?? '';
		const cookieHeader = existingCookies
			? `${existingCookies}; ${result.cookieName}=${result.signedToken}`
			: `${result.cookieName}=${result.signedToken}`;

		const userRes = await fetch(`${PUBLIC_API_URL}/auth/current-user`, {
			headers: { cookie: cookieHeader }
		});
		if (userRes.ok) {
			user = await userRes.json();
		}
	} catch {
		// user stays null, amplitude identify is skipped client-side
	}

	return { user, redirectPath: callbackURL };
};
