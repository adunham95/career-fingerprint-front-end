import { verifyEmail, type VerifyTokenResponse } from '$lib/API/user.js';

export const load = async (event) => {
	const verifyTokenCode = event.url.searchParams.get('token') || '';

	try {
		const tokenDetails = await verifyEmail({ token: verifyTokenCode });

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
