# Career Fingerprint — App Frontend

## What this is

The main application UI for Career Fingerprint. Served at `app.mycareerfingerprint.com`.

Users log weekly achievements in STAR format, track goals, generate resumes, and prep for interviews. Core loop: weekly email prompt → log achievement → resume updates automatically.

**Plans:** `limited-trial` (free, capped at 10 achievements, no card required) and `pro` ($7.99/month).

---

## Stack

- **SvelteKit 2 / Svelte 5** (TypeScript) — use Svelte 5 runes (`$props()`, `$state()`, `$derived()`, etc.)
- **Tailwind CSS v4** — utility classes only, no separate CSS files
- **TanStack Query** (`@tanstack/svelte-query`) — all client-side data fetching and caching
- **Better Auth** — magic link + password. Google OAuth and LinkedIn OAuth not yet implemented.
- **Amplitude** — analytics (session replay + autocapture)
- **Sentry** — error tracking
- **Stripe** — payments via `@stripe/stripe-js`
- **tawk.to** — support chat

---

## Structure

```
src/
├── routes/
│   ├── (app)/          # Authenticated routes — server layout enforces auth
│   │   ├── (organization)/   # Org admin routes (/org/[id]/...)
│   │   └── (admin)/          # Platform admin routes (/admin/...)
│   ├── (auth)/         # Login, register, magic-link, logout
│   └── (marketing)/    # Public pages (/, /demo, /get-started)
├── lib/
│   ├── API/            # API client + TanStack Query hooks, one file per domain
│   ├── Components/     # Svelte components (see below)
│   ├── Stores/         # Svelte stores (tracking.ts)
│   ├── Utils/          # Shared utilities
│   └── server/         # Server-only helpers (auth, better-auth)
└── app.html
```

---

## Conventions

- **Routing:** `+page.svelte`, `+page.server.ts`, `+layout.svelte` — standard SvelteKit conventions.
- **API calls:** all HTTP calls go through `src/lib/API/apiClient.ts` → domain-specific modules. No SvelteKit form actions.
- **Data fetching:** TanStack Query for client-side state. `+page.server.ts` / `+layout.server.ts` for initial SSR loads.
- **Semantic HTML:** use `<button>`, `<input>`, `<label>`, `<nav>`, `<form>` etc. Never wire up `action`/`method` on forms — submit via event handlers and fetch.
- **Auth state:** `src/lib/server/better-auth.ts` → `loadUserFromSession()` in protected layout server files.
- **No raw CSS:** Tailwind v4 utilities only. Use `tailwind-merge` for dynamic class combinations.
- **Feature gating:** `src/lib/Utils/featureGate.ts` for plan-based gates; `src/lib/Utils/permissionGate.ts` for org permission gates.

---

## Brand tokens

| Name          | Hex       | Usage            |
| ------------- | --------- | ---------------- |
| Heatstroke    | `#ff7a8a` | Primary / CTA    |
| Blue Opal     | `#113a5d` | Dark / text      |
| Verditer      | `#00bfa6` | Accent / success |
| Cool December | `#fdfaf9` | Background       |

**Typography:** `Libre Baskerville` for headings, `Josefin Sans` for UI text.

---

## Key routes

| Route                              | Description                              |
| ---------------------------------- | ---------------------------------------- |
| `/dashboard`                       | Main dashboard                           |
| `/dashboard/weekly`                | Weekly check-in page                     |
| `/goals`                           | Goals list                               |
| `/goal/[id]`                       | Goal detail                              |
| `/my-fingerprint`                  | User fingerprint profile                 |
| `/timeline`                        | Achievement timeline                     |
| `/resumes`                         | Resume list                              |
| `/resumes/[id]`                    | Resume detail/editor                     |
| `/meetings`                        | Meetings list                            |
| `/meetings/[meetingId]`            | Meeting detail                           |
| `/cheatsheet/[meetingId]`          | Meeting cheat sheet                      |
| `/prep/[meetingID]`                | Interview prep (research → highlights → review) |
| `/job-applications`                | Job applications list                    |
| `/job-applications/[id]`           | Job application detail                   |
| `/job-applications/[id]/cover-letter` | Cover letter                          |
| `/settings/profile`                | Profile settings                         |
| `/settings/membership`             | Subscription management                  |
| `/settings/billing`                | Billing                                  |
| `/settings/connections`            | Third-party connections                  |
| `/settings/referral`               | Referral program                         |
| `/org/[id]`                        | Org dashboard                            |
| `/org/[id]/seats/[userID]`         | Team member profile                      |
| `/org/[id]/clients/[userID]`       | Client profile                           |
| `/admin`                           | Platform admin dashboard                 |
| `/onboarding`                      | Onboarding flow                          |
| `/join-org/[code]`                 | Join org via invite code                 |

---

## Component library (`src/lib/Components/`)

Components are organized by domain. Key groups:

- **Containers/** — `Card`, `PageContainer`, `TwoColumn`, `SplitCard`
- **FormElements/** — 25+ inputs: `TextInput`, `TextArea`, `Select`, `ComboBox`, `Toggle`, `DateInput`, `FileUpload`, `Rating`, `ChipList`, etc.
- **Forms/** — domain forms: `AchievementForm`, `MeetingForm`, `GoalForm`, `JobDetails`, `StripeCheckout`, etc.
- **GoalCard/** — goal display + milestone editors (checklist, keywords, streak, manual)
- **Header/** — `AccountHeader`, `NavPillButtons`, `TabNav`
- **Buttons/** — `GoogleSignIn`, `LinkedinLogin`, `MenuButton`, `UnlockWithPremiumButton`
- **Calender/** — calendar widget, timeline, event rows
- **Overlays/** — `Modal`, `Drawer`
- **Toasts/** — `ToastContainer` + `toast.ts` store
- **Resumes/** — `BasicResume`
- **Utility** — `Loader`, `Progress`, `Chart`, `StatusBadge`, `TrialBanner`, `FeatureLocked`, `TablePagination`, `PriceBox`, `DiscountCodeInput`, `SocialShare`

---

## API layer (`src/lib/API/`)

- `apiClient.ts` — `createApiClient()` factory with GET/POST/PATCH/DELETE. `ApiError` class with `status`, `errorCode`, `message`.
- `queryClient.ts` — TanStack Query client (10 min stale time, browser-only).
- Domain modules (each exports fetch functions + TanStack Query hooks):
  - `user.ts`, `auth.ts`, `achievements.ts`, `goals.ts`, `job-applications.ts`, `job-positions.ts`, `resume.ts`, `cover-letters.ts`, `meeting.ts`, `prep-answers.ts`, `bullet-points.ts`, `highlights.ts`, `skill-list.ts`, `org.ts`, `clients.ts`, `dashboard.ts`, `notes.ts`, `thankYouNotes.ts`, `education.ts`, `feedback.ts`, `subscription.ts`, `onboarding.ts`, `serverSentEvents.ts`

---

## Features reference

| Feature                  | Notes                                                                                         |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| STAR achievement logging | Situation, Task, Action, Result. Linked to job position.                                      |
| Weekly check-in          | Prompted via email. Route: `/dashboard/weekly`.                                               |
| Streak widget            | Consecutive weekly check-in streak. Links to `/dashboard/weekly`.                            |
| Contribution heatmap     | Fingerprint-logo SVG cells, one per week.                                                     |
| Resume generation        | Auto-built from achievements. `/resumes`                                                      |
| Interview prep           | Multi-step flow: research → highlights → review. `/prep/[meetingID]`                         |
| Meeting cheat sheet      | Quick reference. `/cheatsheet/[meetingId]`                                                    |
| Goals + milestones       | User-defined goals with checklist / keyword / streak / manual milestone types.                |
| Job applications         | Track applications, generate cover letters, link meetings and prep.                           |
| Organizations            | Multi-tenant: org admins manage seats (team) and clients. Deep nested routes under `/org/[id]` |
| Trial banner             | `TrialBanner.svelte` — three reactive states: within limit / approaching / at limit.          |
| Support chat             | tawk.to.                                                                                      |

---

## Adding a new page

1. Create `src/routes/(app)/[path]/+page.svelte` for authenticated pages
2. Add `+page.server.ts` if you need SSR data — call `loadUserFromSession()` from `src/lib/server/better-auth.ts` to protect the route
3. Add an API module to `src/lib/API/` if new backend calls are needed
4. Use brand tokens and existing component patterns

## Adding a plan-gated feature

1. Backend throws `403` with an error code (e.g. `ACHIEVEMENT_LIMIT_REACHED`) when the limit is hit
2. Use `useFeatureGate()` from `src/lib/Utils/featureGate.ts` for proactive checks
3. Handle the error code in the component and show the upgrade prompt (`FeatureLocked.svelte` or `UnlockWithPremiumButton.svelte`)

---

## Things to avoid

- Don't invent colors — use brand tokens above.
- Don't use SvelteKit form actions.
- Don't add new auth logic — use Better Auth helpers in `src/lib/server/better-auth.ts`.
- Don't log PII — sanitize before any Amplitude calls.
- Don't use Svelte 4 syntax — use Svelte 5 runes throughout.
