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