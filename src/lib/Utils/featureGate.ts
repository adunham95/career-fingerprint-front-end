import type { CurrentUser } from '../../app';

const featureGateCache = new Map<string, boolean>();

export function useFeatureGate(feature: string, user: CurrentUser | null) {
	const key = `${feature}-${user?.id ?? 'null'}`;

	if (featureGateCache.has(key)) {
		return featureGateCache.get(key)!;
	}

	if (user === null) {
		featureGateCache.set(key, false);
		return false;
	}

	const result = user?.subscription?.plan.features?.includes(feature) ?? false;
	featureGateCache.set(key, result);

	return result;
}
