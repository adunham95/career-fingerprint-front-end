import { PUBLIC_API_URL } from '$env/static/public';

export const load = async (event) => {
	const id = event.params.id;
	const token = event.cookies.get('accessToken');

	try {
		const resAdmins = await fetch(`${PUBLIC_API_URL}/org/${id}/admins`, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		});
		const admins = await resAdmins.json();
		return { admins };
	} catch (error) {
		console.error(error);
	}
};
