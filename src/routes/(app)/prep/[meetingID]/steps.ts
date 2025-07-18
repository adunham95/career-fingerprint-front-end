interface Step {
	path: string;
	label: string;
}

export function getSteps(id: string = ''): Step[] {
	return [
		{ path: `/prep/${id}`, label: 'Confirm Details' },
		{ path: `/prep/${id}/highlights`, label: 'Highlights' },
		{ path: `/prep/${id}/research`, label: 'Questions' },
		{ path: `/prep/${id}/review`, label: 'View Cheatsheet' }
	];
}

export function getCurrentStepDetails(
	id: string,
	currentStep = 0
): { prevStep: Step | null; currentStep: Step | null; nextStep: Step | null } {
	const steps = getSteps(id);

	return {
		prevStep: steps[currentStep - 1],
		currentStep: steps[currentStep],
		nextStep: steps[currentStep + 1]
	};
}
