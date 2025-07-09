export function getSteps(id: string = '') {
	return [
		{ path: `/prep/${id}`, label: 'Set Up' },
		{ path: `/prep/${id}/details`, label: 'Details' },
		{ path: `/prep/${id}/research`, label: 'Research' },
		{ path: `/prep/${id}/review`, label: 'Review' }
	];
}
