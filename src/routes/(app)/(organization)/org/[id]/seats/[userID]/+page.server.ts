import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	redirect(308, `/org/${event.params.id}/seats/${event.params.userID}/my-fingerprint`);
};
