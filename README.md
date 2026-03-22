# Career Fingerprint – Front End

The SvelteKit front end for Career Fingerprint, a career management platform that helps users track achievements, manage job applications, build resumes, and prepare for interviews.

**Version:** 2.1.0

## Tech Stack

- [SvelteKit 5](https://kit.svelte.dev/) with Svelte 5 runes
- [TailwindCSS 4](https://tailwindcss.com/) with forms and typography plugins
- [TanStack Query](https://tanstack.com/query/latest) for server state
- [Better Auth](https://www.better-auth.com/) with magic link client plugin
- [Stripe JS](https://stripe.com/docs/js) for payments
- [Sentry](https://sentry.io/) for error tracking
- [Mixpanel](https://mixpanel.com/) for analytics
- TypeScript 5

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Other commands:

```bash
npm run build       # Production build
npm run preview     # Preview the production build
npm run check       # Type-check with svelte-check
npm run lint        # Lint and format check
npm run format      # Auto-format with Prettier
```

## Project Structure

```
src/
  routes/
    (app)/          # Protected routes – require authentication
    (auth)/         # Login, register, password reset, onboarding
    (marketing)/    # Public-facing pages (demo, get-started)
    api/            # SvelteKit server endpoints (file upload, etc.)
    join-org/       # Organization join flow
  lib/
    API/            # Typed API client modules
    Components/     # Reusable UI components
    Icons/          # SVG icons
    Images/         # Static images
    Stores/         # Svelte stores
    Utils/          # Utilities and event tracking helpers
    server/         # Server-only utilities
    auth-client.ts  # Better Auth client configuration
  hooks.server.ts   # Server hooks (auth, Sentry, bot blocking)
  hooks.client.ts   # Client hooks
  app.d.ts          # Global TypeScript interfaces
```

## Key Routes

**Protected (requires auth):**
- `/dashboard` – Career dashboard and weekly check-ins
- `/my-fingerprint` – Personal career fingerprint profile
- `/job-applications/[id]` – Job application detail with meetings and cover letters
- `/resumes`, `/resumes/[id]` – Resume builder
- `/goals`, `/goal/[id]` – Goal tracking and milestones
- `/prep/[meetingID]` – Interview prep highlights and research
- `/cheatsheet/[meetingId]` – Interview cheatsheet
- `/timeline` – Career timeline view
- `/settings/*` – Profile, billing, connections, referral, org, membership
- `/org/[id]/*` – Organization admin (clients, admins, seats)
- `/admin/*` – Platform admin (users, orgs)

**Auth (public):**
- `/login`, `/login/[loginToken]` – Login and magic link verification
- `/register`, `/register/org` – User and org registration
- `/forgot-password`, `/reset-password` – Password recovery
- `/onboard/*` – Onboarding flow (achievements, billing, membership)

## Authentication

Authentication uses JWT cookies alongside server-side Redis sessions:

- `accessToken` – JWT, 7-day expiry
- `sessionAccessToken` – UUID session ID stored in Redis, 7-day expiry

On login, the API creates a Redis session and sets both cookies. The protected layout (`(app)/+layout.server.ts`) calls `/auth/current-user` on every request to validate the session. On logout, the session is deleted from Redis and both cookies are cleared.

Magic link login flows through `/login/[loginToken]`, which receives the session ID and access token from the API and sets both cookies server-side.

## Environment Variables

The app requires the following environment variables:

- `PUBLIC_API_URL` – Base URL for the API
- `SENTRY_DSN` – Sentry error tracking DSN
- `PUBLIC_STRIPE_KEY` – Stripe publishable key
- `PUBLIC_MIXPANEL_TOKEN` – Mixpanel project token
