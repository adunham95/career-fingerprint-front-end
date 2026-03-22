import { createAuthClient } from 'better-auth/svelte';
import { magicLinkClient } from 'better-auth/client/plugins';
import { PUBLIC_API_URL } from '$env/static/public';

export const authClient = createAuthClient({
	baseURL: PUBLIC_API_URL,
	plugins: [magicLinkClient()],
});

export type Session = typeof authClient.$Infer.Session;
