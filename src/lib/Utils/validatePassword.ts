export type PasswordRequirement = {
	label: string;
	pass: boolean;
};

export function validatePassword(
	password: string,
	confirmPassword: string,
	useConfirmPassword: boolean = false
) {
	const requirements: PasswordRequirement[] = useConfirmPassword
		? [
				{
					label: 'At least 8 characters',
					pass: password.length >= 8
				},
				{
					label: 'Contains an uppercase letter',
					pass: /[A-Z]/.test(password)
				},
				{
					label: 'Contains a lowercase letter',
					pass: /[a-z]/.test(password)
				},
				{
					label: 'Contains a number',
					pass: /\d/.test(password)
				},
				{
					label: 'Contains a special character',
					pass: /[^\w\s]/.test(password)
				},
				{
					label: 'Passwords Match',
					pass: confirmPassword !== '' && password === confirmPassword
				}
			]
		: [
				{
					label: 'At least 8 characters',
					pass: password.length >= 8
				},
				{
					label: 'Contains an uppercase letter',
					pass: /[A-Z]/.test(password)
				},
				{
					label: 'Contains a lowercase letter',
					pass: /[a-z]/.test(password)
				},
				{
					label: 'Contains a number',
					pass: /\d/.test(password)
				},
				{
					label: 'Contains a special character',
					pass: /[^\w\s]/.test(password)
				}
			];

	const isValid = requirements.every((r) => r.pass);

	return { isValid, requirements };
}
