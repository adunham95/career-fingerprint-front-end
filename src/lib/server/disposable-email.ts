import emailsRaw from './disposable-email-domains.txt?raw';

const disposableDomains = new Set(
	emailsRaw
		.split('\n')
		.map((d) => d.trim().toLowerCase())
		.filter(Boolean)
);

export function isDisposableEmail(email: string): boolean {
	const domain = email.split('@')[1]?.toLowerCase();
	if (!domain) return false;
	return disposableDomains.has(domain);
}
