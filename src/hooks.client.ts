import { PUBLIC_SENTRY_DSN } from '$env/static/public';
import { handleErrorWithSentry, replayIntegration } from '@sentry/sveltekit';
import * as Sentry from '@sentry/sveltekit';

const isProd = process.env.NODE_ENV === 'production';
if (isProd && PUBLIC_SENTRY_DSN) {
	Sentry.init({
		dsn: PUBLIC_SENTRY_DSN,
		enabled: process.env.NODE_ENV === 'production' || false,
		tracesSampleRate: 0.1,
		enableLogs: false,
		replaysSessionSampleRate: 0.05,
		replaysOnErrorSampleRate: 0.5,
		integrations: [replayIntegration()]
	});
}

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
