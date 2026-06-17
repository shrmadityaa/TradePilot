# TradePilot

TradePilot is the foundation for an Explainable Stock Research Assistant built with Next.js 15, TypeScript, Tailwind CSS, PostgreSQL, Prisma, Auth.js, and Zustand.

Stock research features are intentionally not implemented yet. This repository currently provides the production-oriented application skeleton: authentication, protected routes, persistence setup, theming, reusable UI primitives, loading states, and error boundaries.

## Tech Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma ORM
- Auth.js / NextAuth
- Zustand

## Folder Structure

```txt
.
├── prisma/
│   └── schema.prisma
├── public/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── actions.ts
│   │   │   ├── layout.tsx
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── (dashboard)/
│   │   │   └── dashboard/
│   │   │       ├── error.tsx
│   │   │       ├── layout.tsx
│   │   │       ├── loading.tsx
│   │   │       └── page.tsx
│   │   ├── api/auth/[...nextauth]/route.ts
│   │   ├── error.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── not-found.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── auth/auth-form.tsx
│   │   ├── layout/dashboard-shell.tsx
│   │   ├── providers/app-providers.tsx
│   │   └── ui/
│   ├── lib/
│   │   ├── db.ts
│   │   ├── utils.ts
│   │   └── validations/auth.ts
│   ├── stores/use-ui-store.ts
│   └── types/next-auth.d.ts
├── middleware.ts
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## Route Architecture

| Route | Type | Purpose |
| --- | --- | --- |
| `/` | Public | Landing entry with auth-aware CTA |
| `/signup` | Public | Create account with credentials |
| `/login` | Public | Login with credentials |
| `/dashboard` | Protected | Authenticated foundation dashboard |
| `/api/auth/[...nextauth]` | API | Auth.js route handlers |

Protected access is enforced in both `middleware.ts` and the dashboard layout.

## Database Models

The Prisma schema includes:

- `User`: application user with optional `passwordHash` and `role`
- `Account`: Auth.js adapter model for OAuth/provider accounts
- `Session`: Auth.js adapter model for database sessions
- `VerificationToken`: Auth.js adapter model for token flows
- `UserRole`: `USER` and `ADMIN`

The current credentials flow uses JWT sessions and stores hashed passwords with `bcryptjs`.

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then update:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tradepilot?schema=public"
AUTH_SECRET="replace-with-a-secure-random-secret"
AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Generate a strong local secret:

```bash
openssl rand -base64 32
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start PostgreSQL and create the database:

```bash
createdb tradepilot
```

3. Configure `.env` from `.env.example`.

4. Generate Prisma Client and run the first migration:

```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Start the development server:

```bash
npm run dev
```

6. Open `http://localhost:3000`.

## Available Scripts

```bash
npm run dev
npm run build
npm run typecheck
npm run lint
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
```

## Next Steps

- Add email verification and password reset flows.
- Add OAuth providers if needed.
- Add stock research domain models after product requirements are finalized.
- Add integration tests for auth and protected routes.
