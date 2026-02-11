import type { CurrentUser } from '../../app';

const featureGateCache = new Map<string, boolean>();

export function useFeatureGate(featureLevel: number, user: CurrentUser | null) {
	const key = `${featureLevel}-${user?.planLevel ?? 'null'}`;

	if (featureGateCache.has(key)) {
		return featureGateCache.get(key)!;
	}

	if (user === null) {
		featureGateCache.set(key, false);
		return false;
	}

	const result = user.planLevel >= featureLevel;
	featureGateCache.set(key, result);

	return result;
}
