const SECURITY_SENSITIVE_CODES = new Set([
	'EMAIL_IN_USE',
	'ACCOUNT_EXISTS',
	'USER_ALREADY_REGISTERED',
	'USER_ALREADY_EXISTS',
	'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL'
]);

const GENERIC_ERROR = 'Something went wrong. Please try again.';
const SECURITY_ERROR = 'Please check your details and try again.';

export function classifyError(
	code: string | undefined,
	message: string
): { userMessage: string; field: string | null } {
	if (code && SECURITY_SENSITIVE_CODES.has(code)) {
		return { userMessage: SECURITY_ERROR, field: null };
	}

	if (code === 'INVALID_EMAIL' || message.toLowerCase().includes('invalid email')) {
		return { userMessage: 'Please enter a valid email address.', field: 'email' };
	}

	if (
		code === 'PASSWORD_TOO_SHORT' ||
		(message.toLowerCase().includes('password') && message.toLowerCase().includes('short'))
	) {
		return { userMessage: 'Password does not meet requirements.', field: 'password' };
	}

	if (code === 'MISSING_FIELD' || message.toLowerCase().includes('required')) {
		return { userMessage: message, field: null };
	}

	console.error('[classifyError] Unhandled API error:', code, message);
	return { userMessage: GENERIC_ERROR, field: null };
}
