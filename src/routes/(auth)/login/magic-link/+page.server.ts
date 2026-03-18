import { redirect } from '@sveltejs/kit';
import { PUBLIC_API_URL } from '$env/static/public';

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

	redirect(302, callbackURL);
};
