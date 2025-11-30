import { loginWithToken } from '$lib/API/auth.js';
import { isRedirect, redirect } from '@sveltejs/kit';

export const load = async (event) => {
	console.log({ verifyTokenCode: event.params.loginToken });
	try {
		const tokenDetails = await loginWithToken(event.params.loginToken);

		console.log({ tokenDetails });

		if (tokenDetails?.accessToken) {
			console.log('accessToken', tokenDetails.accessToken);
			const isProd = process.env.NODE_ENV === 'production';
			// User cookie just to create trial
			event.cookies.set('accessToken', tokenDetails.accessToken, {
				httpOnly: true,
				secure: isProd,
				sameSite: isProd ? 'none' : 'lax',
				maxAge: 60 * 60 * 24 * 1, // 7 days
				path: '/',
				...(isProd && {
					domain: process.env.COOKIE_DOMAIN // <-- only in prod
				})
			});

			event.locals.tokens = { accessToken: tokenDetails?.accessToken };
			event.locals.user = null; // not fetched yet
		}
		switch (tokenDetails?.type) {
			case 'check-in':
				throw redirect(303, '/dashboard/weekly');
				break;

			default:
				throw redirect(303, '/dashboard');
				break;
		}
	} catch (error) {
		if (isRedirect(error)) throw error;
		console.error(error);
		redirect(303, '/login');
	}
};
