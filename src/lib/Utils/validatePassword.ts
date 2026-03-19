export type PasswordRequirement = {
	label: string;
	pass: boolean;
	errorLabel: string;
};

export type PasswordStrength = 0 | 1 | 2 | 3 | 4;

export function validatePassword(
	password: string,
	confirmPassword: string = '',
	useConfirmPassword: boolean = false
) {
	const requirements: PasswordRequirement[] = [
		{
			label: 'At least 8 characters',
			errorLabel: 'Must contain at least 8 characters',
			pass: password.length >= 8
		},
		{ label: 'Contains an uppercase letter', errorLabel: 'Must contain at least one uppercase letter', pass: /[A-Z]/.test(password) },
		{ label: 'Contains a lowercase letter', errorLabel: 'Must contain at least one lowercase letter', pass: /[a-z]/.test(password) },
		{ label: 'Contains a number', errorLabel: 'Must contain at least one number', pass: /\d/.test(password) },
		{
			label: 'Contains a special character (!@#$%&*-_+()?)',
			errorLabel: 'Must contain at least one special character (!@#$%&*-_+()?)',
			pass: /[!@#$%&*\-_+()?]/.test(password)
		}
	];

	if (useConfirmPassword) {
		requirements.push({
			label: 'Passwords match',
			errorLabel: 'Passwords do not match',
			pass: confirmPassword !== '' && password === confirmPassword
		});
	}

	const isValid = requirements.every((r) => r.pass);
	const strength = getPasswordStrength(password);

	return { isValid, requirements, strength };
}

function getPasswordStrength(password: string): PasswordStrength {
	if (!password) return 0;
	const passed = [
		password.length >= 8,
		password.length >= 12,
		/[A-Z]/.test(password),
		/[a-z]/.test(password),
		/\d/.test(password),
		/[!@#$%&*\-_+()?]/.test(password)
	].filter(Boolean).length;

	if (passed <= 1) return 1;
	if (passed <= 3) return 2;
	if (passed <= 4) return 3;
	return 4;
}
