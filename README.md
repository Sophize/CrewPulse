# Crew Pulse

Crew Pulse is an employee management dashboard built with Next.js, TypeScript, Prisma, PostgreSQL, Firebase Authentication, and Mantine UI.

## Features

- Employee Management
- Firebase Authentication
- Activity Tracking
- Learning Progress Tracking
- Learning Status Tracking
- Employee Status Monitoring
- Timesheet Management
- Last Seen Tracking
- Admin Dashboard

---

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Mantine UI
- React Query
- React Hook Form
- TanStack Table

### Backend

- Next.js API Routes
- Prisma ORM
- Firebase Admin SDK

### Database

- PostgreSQL 16+

---

## Deployment

- Vercel (Frontend + API Routes)
- Neon PostgreSQL (Production Database)
- Firebase Authentication

---

## Prerequisites

Install the following software before setting up the project:

- Node.js 22 LTS
- PostgreSQL 16.x
- Git

Verify installation:

```bash
node -v
npm -v
git --version
psql --version
```

---

## Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd crewpulse
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root using the values provided by the project administrator.

Required environment variables:

```env
DATABASE_URL=

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

---

## Database Setup

### Create Database

Open PostgreSQL and run:

```sql
CREATE DATABASE crewpulse;
```

### Run Prisma Migrations

All database migrations are committed to the repository.

Run:

```bash
npx prisma migrate dev
```

### Generate Prisma Client

```bash
npx prisma generate
```

---

## Production Deployment

After deploying schema changes, always apply Prisma migrations to the production database to keep the schema synchronized.

```bash
npx prisma migrate deploy
```

---

## Running the Application

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Available Scripts

### Development

```bash
npm run dev
```

Starts the development server.

### Build

```bash
npm run build
```

Creates an optimized production build.

### Production

```bash
npm start
```

Runs the production build.

### Lint

```bash
npm run lint
```

Runs ESLint checks.

### Prisma Studio

```bash
npx prisma studio
```

Opens Prisma Studio for database management.

---

## Database Schema

### User

Stores employee information:

- Name
- Email
- Role
- Firebase UID
- Learning Status
- Learning Details
- Current Learning
- Last Seen Timestamp

### Timesheet

Stores weekly timesheet information:

- Week Start Date
- Total Hours
- Categories
- Sync Timestamp

### ActivityEvent

Stores employee activity records:

- Event Type
- Event Message
- Creation Timestamp

---

## Database Migrations

The project currently includes migrations for:

- Initial schema setup
- Activity events
- Firebase authentication support
- Learning details
- Learning status
- Last seen tracking

---

## Project Structure

```text
src/
├── api/
├── components/
├── context/
├── features/
├── firebase/
├── hooks/
├── lib/
├── pages/
├── services/
├── styles/
├── types/
└── utils/

prisma/
├── migrations/
└── schema.prisma
```

---

## Troubleshooting

### Prisma Errors

Regenerate Prisma Client:

```bash
npx prisma generate
```

### Migration Issues

Reset and reapply migrations:

```bash
npx prisma migrate reset
```

### PostgreSQL Connection Issues

Verify that:

- PostgreSQL is running
- Database `crewpulse` exists
- `DATABASE_URL` is configured correctly
- PostgreSQL is listening on port `5432`

---

## Important Notes

- Use PostgreSQL 16.x for local development.
- Do not commit `.env`, `.env.local`, or `.env.production`.
- Store required environment variables in `.env.local`.
- Never commit Firebase credentials or database secrets to version control.

