import { createApiClient } from '$lib/API/apiClient.js';
import { getPlansAvailableToUpgrade } from '$lib/API/subscription.js';
import { currentUserBillingStatus } from '$lib/API/user.js';

export const load = async (event) => {
	try {
		const api = createApiClient(event);
		const [availablePlans] = await Promise.all([
			getPlansAvailableToUpgrade(api),
			currentUserBillingStatus(api)
		]);
		return { availablePlans };
	} catch (error) {
		console.error(error);
	}
};
