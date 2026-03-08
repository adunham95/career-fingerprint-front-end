import { loginWithToken } from '$lib/API/auth.js';
import { loadUser } from '$lib/server/auth.js';
import { isRedirect, redirect } from '@sveltejs/kit';

export const load = async (event) => {
	console.log({ verifyTokenCode: event.params.loginToken });
	try {
		const tokenDetails = await loginWithToken(event.params.loginToken);

		console.log({ tokenDetails });

		if (tokenDetails?.accessToken) {
			console.log('accessToken', tokenDetails.accessToken);
			const isProd = process.env.NODE_ENV === 'production';
			const cookieOptions = {
				httpOnly: true,
				secure: isProd,
				sameSite: (isProd ? 'none' : 'lax') as 'none' | 'lax',
				maxAge: 60 * 60 * 24 * 7,
				path: '/',
				...(isProd && { domain: process.env.COOKIE_DOMAIN })
			};
			event.cookies.set('accessToken', tokenDetails.accessToken, cookieOptions);

			if (tokenDetails.sessionID) {
				event.cookies.set('sessionAccessToken', tokenDetails.sessionID, cookieOptions);
				event.locals.session = tokenDetails.sessionID;
			}

			event.locals.tokens = { accessToken: tokenDetails.accessToken };
			event.locals.user = null;
		}

		let redirectPath: string;
		switch (tokenDetails?.type) {
			case 'check-in':
				redirectPath = '/dashboard/weekly';
				break;

			default:
				redirectPath = '/dashboard';
				break;
		}

		const user = await loadUser(event);

		return { redirectPath, user };
	} catch (error) {
		if (isRedirect(error)) throw error;
		console.error(error);
		redirect(303, '/login');
	}
};
