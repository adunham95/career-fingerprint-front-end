import { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN } from '$env/static/private';
import { json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
	const formData = await request.formData();
	const file = formData.get('file') as File;

	const cloudflareForm = new FormData();
	cloudflareForm.append('file', file);

	const response = await fetch(
		`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`
			},
			body: cloudflareForm
		}
	);

	const result = await response.json();
	console.log({ result });
	return json(result);
};
