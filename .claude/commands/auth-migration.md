# Better Auth Migration

Explore the codebase and implement Better Auth across the SvelteKit frontend and NestJS backend.

## Requirements

1. **Magic link support** — users can log in via emailed links with a `redirectTo` param for post-auth routing
2. **Password migration** — existing users keep their current passwords (detect hash format and verify accordingly)
3. **SvelteKit frontend + NestJS backend**
4. **Session support** — cookie-based sessions
5. **Social login** — Google and LinkedIn (OpenID Connect)

## Steps

### 1. Explore the codebase first

- Find the existing auth implementation (services, guards, middleware, JWT config, Passport strategies)
- Find the user/account schema or entity to understand current password hash storage
- Find the SvelteKit auth-related routes, stores, and hooks
- Find the NestJS app entry point (`main.ts`) to check bodyParser config
- Check `package.json` (both apps) for current auth dependencies

### 2. Plan before touching anything

- List every file that needs to change
- Note the current password hashing algorithm in use so the migration verify function is correct
- Identify the current user table structure so you know how to map it to Better Auth's `user` + `account` tables

### 3. Backend (NestJS)

- Install `better-auth` and `@thallesp/nestjs-better-auth`
- Disable the built-in body parser in `main.ts`
- Create `src/auth/auth.ts` with Better Auth config:
  - `emailAndPassword` with custom `hash` and `verify` to handle existing password hashes
  - `magicLink` plugin with `sendMagicLink` wired to the existing email service
  - `socialProviders` for Google and LinkedIn
  - Cookie-based sessions
- Register `AuthModule.forRoot({ auth })` in `AppModule`
- Replace any existing Passport guards with `@Session()` decorator and `AuthGuard` from the integration
- Write a migration script to copy existing users into Better Auth's `user` and `account` tables

### 4. Frontend (SvelteKit)

- Install `better-auth`
- Create `src/lib/auth-client.ts` using `createAuthClient` from `better-auth/svelte`
- Update `hooks.server.ts` to validate sessions via Better Auth
- Update login/signup pages to use the new auth client methods
- Add Google and LinkedIn OAuth buttons
- Add magic link request UI
- Handle the magic link callback route with `redirectTo` support

### 5. Schema migration

- Generate Better Auth schema (`npx @better-auth/cli generate`)
- Write migration SQL/script to move existing users and password hashes into the new `user` and `account` tables
- Ensure password hashes land in the `account` table under `providerId: "credential"`

## Key constraints

- Do NOT break existing users — password migration must be seamless
- The custom `verify` function must detect the existing hash format (check prefix) and route to the correct algorithm, falling back to scrypt for new signups
- Do not remove existing DB tables until migration is verified

### 6. Backend test suite (NestJS)

- Check existing test setup — find any `jest.config`, `*.spec.ts` files, and test utilities already in place
- Install any missing test dependencies (`@nestjs/testing`, `supertest`)
- Write tests for each auth flow:

**Magic link**

- Requesting a magic link for an existing user sends an email
- Requesting a magic link for an unknown email does not leak user existence
- A valid token logs the user in and creates a session
- An expired or invalid token returns 401
- `redirectTo` param is preserved through the callback

**Password auth**

- Existing user with legacy hash (bcrypt/argon2/whatever is found in codebase) can sign in
- New user created via Better Auth uses scrypt and can sign in
- Wrong password returns 401
- Unknown email returns 401 without leaking user existence

**Social login (Google + LinkedIn)**

- OAuth redirect URL is generated correctly
- Callback with valid code creates or links a user account
- Callback with invalid/missing code returns 400

**Sessions**

- Authenticated request with valid session cookie succeeds
- Request without session cookie is rejected by `AuthGuard`
- `@AllowAnonymous()` routes are accessible without a session
- Session is invalidated on sign out

**Migration integrity**

- Migrated users exist in the `user` table
- Password hashes are in the `account` table under `providerId: "credential"`
- No duplicate users created if migration is run twice (idempotent)

## Test conventions

- Use `@nestjs/testing` `TestingModule` for unit tests
- Use `supertest` for e2e/integration tests against the full NestJS app
- Mock the email service so magic link tests don't send real emails — capture the generated link for use in callback tests
- Use a separate test database or transaction rollback to keep tests isolated
- Mirror the existing test file structure and naming conventions found in the codebase
