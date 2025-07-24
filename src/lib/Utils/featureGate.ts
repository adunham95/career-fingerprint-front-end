import type { CurrentUser } from '../../app';

export function useFeatureGate(featureLevel: number, user: CurrentUser | null) {
	console.log({ featureLevel, planLevel: user?.planLevel });
	if (user === null) return false;
	if (user.planLevel > featureLevel) return true;
	return false;
}
