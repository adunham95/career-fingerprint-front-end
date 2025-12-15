const permissionGateCache = new Map<string, boolean>();

export function permissionGate(requiredPermissions: string[], myPermissions: string[] = []) {
	// Stable cache key
	const key = JSON.stringify([requiredPermissions, myPermissions]);
	if (permissionGateCache.has(key)) {
		return permissionGateCache.get(key)!;
	}

	const permissionSet = new Set(myPermissions);
	const wildcardPrefixes: string[] = [];

	for (const p of permissionSet) {
		if (p.endsWith(':*')) {
			wildcardPrefixes.push(p.slice(0, -2)); // remove :*
		}
	}

	const result = requiredPermissions.some((needed) => {
		// Exact match
		if (permissionSet.has(needed)) return true;

		// Wildcard match
		for (const prefix of wildcardPrefixes) {
			if (needed.startsWith(prefix + ':')) return true;
		}

		return false;
	});

	permissionGateCache.set(key, result);
	return result;
}
