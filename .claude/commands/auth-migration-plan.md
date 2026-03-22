# Better Auth Migration Plan

## Phase 1: Install Dependencies and Schema Setup

**Files to change:**
- `api/package.json` — add `better-auth`, `@thallesp/nestjs-better-auth`, `@better-auth/prisma-adapter`
- `front-end/package.json` — add `better-auth`
- `api/prisma/schema.prisma` — append 4 Better Auth tables (`ba_user`, `ba_session`, `ba_account`, `ba_verification`) + add `legacyUserId Int? @unique` to `ba_user` as a bridge to existing `Int` PKs

**Why `legacyUserId`:** All app data (resumes, goals, etc.) uses `Int` FKs to `User.id`. Better Auth uses `String` (cuid) IDs. The bridge field lets both coexist without touching 30+ models.

---

## Phase 2: Better Auth Server Config (API)

**Files to create:**
- `api/src/auth-better/better-auth.config.ts` — main `betterAuth({...})` instance
- `api/src/auth-better/better-auth.module.ts`
- `api/src/auth-better/better-auth.controller.ts` — wildcard handler for `/api/auth/*`
- `api/src/auth-better/better-auth.guard.ts` — replaces `SessionOrJwtGuard` eventually
- `api/src/auth-better/better-auth-hooks.ts` — post-signup side effects (welcome email, Stripe, audit log)

**Key config details:**
- `emailAndPassword` with custom `verify`: detects `$2b$` prefix for bcrypt path, otherwise scrypt
- `magicLink` plugin wired to existing `MailService`
- `socialProviders`: Google + LinkedIn
- Cookie prefix `cf`, matching existing `sameSite`/`domain` env vars
- Session TTL 7 days (matches current)

**New env vars needed:**
```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
```

---

## Phase 3: Data Migration Script

**Files to create:**
- `api/prisma/scripts/migrate-to-better-auth.ts` — idempotent, batched migration
- `api/prisma/scripts/verify-better-auth-migration.ts` — count check, exits 1 if discrepancies

**Logic per `User` row:**
1. Skip if `ba_user` with `legacyUserId = user.id` already exists
2. Create `ba_user` with name, email, emailVerified, legacyUserId
3. Create `ba_account` with `providerId: 'credential'`, `password = user.password` (bcrypt hash copied verbatim -- custom verify handles it)

SAML users (empty password) get `providerId: 'saml'` with no password. They will re-authenticate via social login or magic link after cutover.

---

## Phase 4: Frontend Auth Client

**Files to create:**
- `front-end/src/lib/auth-client.ts` — `createAuthClient` from `better-auth/svelte` + `magicLinkClient` plugin
- `front-end/src/lib/server/better-auth.ts` — server-side session loader (replaces `src/lib/server/auth.ts`)

---

## Phase 5: Frontend Route Cutover

Do one route at a time and test in staging before moving to the next.

| File | Change |
|------|--------|
| `src/routes/(auth)/login/+page.svelte` | Replace fetch to `/auth/login` with `authClient.signIn.email()` + add Google/LinkedIn buttons |
| `src/routes/(auth)/register/+page.svelte` | Replace with `authClient.signUp.email()` |
| `src/routes/(auth)/forgot-password/+page.svelte` | Replace with `authClient.requestPasswordReset()` |
| `src/routes/(auth)/login/[loginToken]/+page.server.ts` | Rewrite for BA magic link callback; preserve `redirectTo` param |
| `src/routes/(auth)/logout/` | Replace API call with `authClient.signOut()` + clear legacy cookies |
| `src/routes/(app)/+layout.server.ts` | Swap `loadUser()` for `loadUserFromSession()` |
| `src/hooks.server.ts` | Dual-support during transition: check `cf.session_token` first, fall back to old cookies |

---

## Phase 6: API Guard Cutover

**File to modify:** `api/src/auth/session-auth.guard.ts`

Extend to a three-tier fallback during the transition window:
1. Better Auth `cf.session_token` (Postgres-backed)
2. Legacy Redis `sessionAccessToken`
3. Legacy JWT `accessToken`

Use `ba_user.legacyUserId` to load the integer-ID user for `req.user`, keeping all controllers unchanged.

**SAML:** Since SAML is not actively in use, `api/src/auth/saml.strategy.ts` and the SSO controller endpoints (`GET /auth/sso`, `POST /auth/sso/callback`) can be deleted. This also removes the `?token=` URL workaround in `hooks.server.ts`.

---

## Phase 7: Cleanup

Allow 2-4 weeks of production monitoring with both systems running. When metrics show 0 active Redis sessions and 0 JWT-only requests, proceed.

**Delete:**
- `api/src/auth/jwt.strategy.ts`
- `api/src/auth/saml.strategy.ts`
- `api/src/authcookie/authcookie.service.ts`
- `api/src/login-token/` (whole module)
- Redis session logic from `api/src/cache/cache.service.ts`

**Modify:**
- `api/src/auth/auth.module.ts` — remove Passport, JwtModule, JwtStrategy
- `api/src/auth/auth.controller.ts` — remove `/auth/login`, `/auth/logout`, `/auth/request-reset`, `/auth/reset-password`
- `src/hooks.server.ts` — remove legacy cookie fallback

**DB migration:**
```
npx prisma migrate dev --name drop_legacy_auth_tables
```
Drop `LoginToken`, `ResetToken`, `VerifyToken` tables. Keep `legacyUserId` on `ba_user` indefinitely.

---

## Phase 8: Test Suite

| Test file | Covers |
|-----------|--------|
| `api/src/auth-better/password-verify.spec.ts` | bcrypt detection, scrypt round-trip, wrong passwords |
| `api/src/auth-better/better-auth.service.spec.ts` | `getSession()` valid/expired/absent |
| `api/src/auth/session-auth.guard.spec.ts` | Three-tier fallback, missing legacy user |
| `api/prisma/scripts/migrate-to-better-auth.spec.ts` | Idempotency, hash preservation, SAML/empty-password users |
| `api/src/auth-better/magic-link.integration.spec.ts` | Send, verify, expire, `redirectTo` |
| `api/src/auth-better/social-login.integration.spec.ts` | New user, returning user, account linking |
| `api/test/auth-better.e2e-spec.ts` | Full register → login → current-user → logout flow |

### Test conventions
- Use `@nestjs/testing` `TestingModule` for unit tests
- Use `supertest` for e2e/integration tests against the full NestJS app
- Mock `MailService` in magic link tests -- capture the generated link for use in callback tests
- Use a separate test database or transaction rollback to keep tests isolated
- Mirror existing test file structure and naming conventions

---

## Key Risks and Notes

**Biggest risk:** `api/src/auth/session-auth.guard.ts` -- the three-tier fallback must populate `req.user` identically to today or every downstream controller breaks. Test this thoroughly before cutting any frontend routes over.

**Do not break existing users:** The custom `verify` function is the critical seam. It must detect `$2b$` / `$2a$` prefixes and route to bcrypt. All other hashes fall through to scrypt.

**Do not drop legacy DB tables** until the migration is verified and the cleanup window has passed.

**Migration script must be idempotent** -- safe to run multiple times without creating duplicate users.
