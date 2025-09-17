import { createMutation } from '@tanstack/svelte-query';
import type { BulletPoint } from '../../app';
import { createApiClient } from './apiClient';

export async function addBulletPoint(data: {
	jobPositionID?: string;
	educationID?: string;
	text?: string;
	resumeID: string;
}): Promise<BulletPoint> {
	try {
		const api = createApiClient();

		return api.post('/bullet-points', data);
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
	try {
		const api = createApiClient();
		return api.del(`/bullet-points/${bulletPointID}`);
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
