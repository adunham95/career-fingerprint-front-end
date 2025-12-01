export function permissionGate(requiredPermissions: string[], myPermissions: string[] = []) {
	const permissionList: Set<string> = new Set(myPermissions);
	const hasPermission = (needed: string): boolean => {
		console.log('needed', needed);

		console.log('Has needed:', permissionList.has(needed));
		console.log('Has: ', permissionList);
		// Exact match
		if (permissionList.has(needed)) return true;

		for (const p of permissionList) {
			if (p.endsWith(':*')) {
				const [userPrefix] = p.split(':');
				if (needed.startsWith(`${userPrefix}:`)) return true;
			}
		}

		return false;
	};

	return requiredPermissions.some(hasPermission);
}
