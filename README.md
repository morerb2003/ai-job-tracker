# AI-Powered Job Tracking Platform

A production-grade AI-powered job tracking platform built using:

- React.js
- Spring Boot
- PostgreSQL
- Spring AI
- Redis
- Docker

## Features

- Job Application Tracking
- Kanban Board
- Resume Analysis
- Skill Gap Detection
- Interview Scheduling
- Analytics Dashboard

## Backend setup

The backend uses PostgreSQL and requires these environment variables before startup:

```powershell
$env:DB_URL = "jdbc:postgresql://localhost:5432/job_tracker"
$env:DB_USERNAME = "postgres"
$env:DB_PASSWORD = "your-postgres-password"
```

Start it from the `backend` directory with `./mvnw.cmd spring-boot:run`.

## Authentication and sessions

The authentication flow uses short-lived JWT access tokens and rotating refresh tokens. The browser keeps the access token in memory; the refresh token is sent only as an HttpOnly cookie and is stored as a SHA-256 hash in PostgreSQL. See [docs/authentication.md](docs/authentication.md) for the API contract, cookie settings, production requirements, and remaining security work.

For production, activate the `prod` profile, serve the frontend and API over HTTPS, and set `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, a strong `JWT_SECRET`, and the exact comma-separated trusted frontend origins in `CORS_ALLOWED_ORIGINS`. The production profile requires `JWT_SECRET` and `CORS_ALLOWED_ORIGINS` and marks the refresh cookie Secure. Set `REFRESH_COOKIE_SAME_SITE=None` when frontend and API are hosted cross-site.
