import { verifyJoinCode } from '$lib/API/org.js';
import { loadUser } from '$lib/server/auth.js';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const user = await loadUser(event);

	const joinCode = event.params.code;

	if (!joinCode) {
		redirect(307, '/dashboard');
	}

	const verifyResponse = await verifyJoinCode({ joinCode });

	return { verifyResponse, user, joinCode };
};
