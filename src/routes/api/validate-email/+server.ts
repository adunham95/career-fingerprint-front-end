import { isDisposableEmail } from '$lib/server/disposable-email';
import { json, type RequestEvent } from '@sveltejs/kit';

export const POST = async ({ request }: RequestEvent) => {
	const { email } = await request.json();

	if (!email || typeof email !== 'string') {
		return json({ disposable: false });
	}

	return json({ disposable: isDisposableEmail(email.trim().toLowerCase()) });
};
