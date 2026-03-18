import { createApiClient } from '$lib/API/apiClient.js';
import { getPlansAvailableToUpgrade, getSubscriptionDetails } from '$lib/API/subscription.js';
export const load = async (event) => {
	try {
		const api = createApiClient(event);
		const membershipDetails = await getSubscriptionDetails(api);
		const availablePlans = await getPlansAvailableToUpgrade(api);
		console.log({ membershipDetails, availablePlans });
		return { membershipDetails, availablePlans };
	} catch (error) {
		console.error(error);
	}
};
