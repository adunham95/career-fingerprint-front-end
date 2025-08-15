import { PUBLIC_API_URL } from '$env/static/public';
import { createMutation } from '@tanstack/svelte-query';
import type { BulletPoint } from '../../app';

export async function addBulletPoint(data: {
	jobPositionID?: string;
	educationID?: string;
	text?: string;
	resumeID: string;
}): Promise<BulletPoint> {
	const url = `${PUBLIC_API_URL}/bullet-points`;

	try {
		const res = await fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		if (res.ok) {
			return await res.json();
		} else {
			const message = await res.text();
			throw new Error(`Failed to add bullet point: ${res.status} ${message}`);
		}
	} catch (error) {
		console.log(error);
		throw new Error('Failed to add bullet point');
	}
}

export async function deleteBulletPoint({
	bulletPointID
}: {
	bulletPointID: string;
}): Promise<BulletPoint> {
	const url = `${PUBLIC_API_URL}/bullet-points/${bulletPointID}`;

	try {
		const res = await fetch(url, {
			method: 'DELETE',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (res.ok) {
			return await res.json();
		} else {
			const message = await res.text();
			throw new Error(`Failed to delete bullet point. ${message}`);
		}
	} catch (error) {
		console.log(error);
		throw new Error('Failed to delete bullet point');
	}
}

export const useCreateBulletPoint = () => {
	return createMutation({
		mutationFn: addBulletPoint,
		onSuccess: () => {},
		onError: (error) => {
			console.error('Failed to create bullet point:', error);
		}
	});
};

export const useDeleteBulletPoint = () => {
	return createMutation({
		mutationFn: deleteBulletPoint,
		onSuccess: () => {},
		onError: (error) => {
			console.error('Failed to delete bullet point:', error);
		}
	});
};
