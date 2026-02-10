import { PUBLIC_SENTRY_DSN } from '$env/static/public';
import * as Sentry from '@sentry/sveltekit';

if (process.env.NODE_ENV === 'production' && PUBLIC_SENTRY_DSN) {
	Sentry.init({
		dsn: PUBLIC_SENTRY_DSN,
		tracesSampleRate: 0.1,
		enableLogs: false
		// uncomment the line below to enable Spotlight (https://spotlightjs.com)
		// spotlight: import.meta.env.DEV,
	});
}
