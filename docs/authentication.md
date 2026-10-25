# Authentication and session behavior

## Sign-up and sign-in

- Registration trims the name and email, validates the email and password length, normalizes the email, and always creates a `USER` account. A client cannot choose an elevated role.
- Passwords are hashed with BCrypt before they are saved.
- Login returns a short-lived JWT access token and sets the refresh token in an HttpOnly cookie. The refresh token is never returned in JSON.
- Invalid email and password combinations use the same response to avoid revealing whether an account exists.

## Token lifecycle

- The access JWT expires after 15 minutes by default. The frontend keeps it in memory and adds it as a Bearer token to protected API requests.
- The refresh token is an opaque, cryptographically random value. PostgreSQL stores only its SHA-256 hash.
- The refresh cookie is scoped to `/api/v1/auth`, marked HttpOnly and SameSite=Lax, and expires after seven days by default. The development profile allows HTTP; the production profile requires Secure cookies.
- Refresh rotates the cookie value and revokes the previous token. Expired token rows are removed during token issuance.
- Logout revokes the refresh token and clears the browser cookie. Since access JWTs are stateless, an already issued access token can remain usable until its short expiration time.
- Refresh requests are shared while one is in flight in a browser tab, and the database locks the token row while rotating it so concurrent refreshes from separate requests cannot both reuse the same token. An expired or rejected refresh clears the in-memory session; a temporary network or server failure does not invalidate the current access token.

## Authorization

- Roles are stored on the user record as `USER` or `ADMIN`. Public registration always creates a `USER`; the client cannot submit a role.
- The JWT filter loads the user's current role from PostgreSQL on each authenticated request. The API does not trust a role value supplied by the browser or only from a JWT claim.
- Authenticated non-admin API routes require either `USER` or `ADMIN`. Routes under `/api/v1/admin/**` require `ADMIN`, with both a URL security rule and a method-level guard.
- `GET /api/v1/admin/users` returns profile fields only and is available through the admin-only frontend route `/admin/users`.
- The frontend hides admin navigation and shows an access-denied page for other roles. This is a user-interface safeguard; the backend authorization remains the security boundary.
- There is no self-service role-change API. Provision or remove administrator roles through a controlled operator process, and audit those changes.
- Application records are scoped to the authenticated user in the service layer.

## Production configuration

Use HTTPS and configure `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, and `CORS_ALLOWED_ORIGINS` in the deployment environment. The `prod` profile fails to start without `JWT_SECRET` or `CORS_ALLOWED_ORIGINS` and sets the refresh cookie's Secure flag. `CORS_ALLOWED_ORIGINS` must contain the exact trusted frontend origins as a comma-separated list. Set `REFRESH_COOKIE_SAME_SITE=None` only when frontend and API are cross-site; browsers require `Secure` for that setting, which the production profile enables.

Flyway migration `V4__secure_refresh_tokens.sql` hashes refresh tokens already stored by earlier versions. Existing browser sessions must sign in again after the migration because older clients kept refresh tokens in local storage.

## Remaining production work

This module does not yet include email verification, password reset, multi-factor authentication, login rate limiting, account/session management, or immediate revocation of access JWTs. These need an email delivery provider, abuse controls, or a server-side access-token revocation strategy before claiming full production readiness. Production deployment also needs a trusted-origin review, a documented administrator provisioning procedure, HTTPS, and monitoring for repeated authentication failures.
