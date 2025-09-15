import { verifyEmail, type VerifyTokenResponse } from '$lib/API/user.js';

export const load = async (event) => {
	const verifyTokenCode = event.url.searchParams.get('token') || '';
	const showFreeTrial = event.url.searchParams.get('showFreeTrial') === 'true' || false;

	console.log({ verifyTokenCode, showFreeTrial });

	try {
		const tokenDetails = await verifyEmail({ token: verifyTokenCode, showFreeTrial });

		if (tokenDetails?.accessToken) {
			// User cookie just to create trial
			event.cookies.set('accessToken', tokenDetails.accessToken, {
				path: '/stripe', // Only available on the verify page
				secure: process.env.NODE_ENV === 'production',
				maxAge: 30 * 60 * 1000, // Cookie expires in 5 days
				httpOnly: true,
				sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
			});
			// User cookie just to add to org subscription
			event.cookies.set('accessToken', tokenDetails.accessToken, {
				path: '/subscriptions', // Only available on the verify page
				secure: process.env.NODE_ENV === 'production',
				maxAge: 30 * 60 * 1000, // Cookie expires in 5 days
				httpOnly: true,
				sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
			});
		}

		return { tokenDetails };
	} catch (error) {
		console.error(error);
		return {
			tokenDetails: {
				verified: false,
				accessToken: '', // required by VerifyTokenResponse
				plan: undefined // explicitly missing
			} satisfies VerifyTokenResponse
		};
	}
};
