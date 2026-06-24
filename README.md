# TradePilot

TradePilot is an Explainable Stock Research Assistant built with Next.js 15, TypeScript, Tailwind CSS, PostgreSQL, Prisma, Auth.js, and Zustand. It tracks market data, watchlists, user holdings, and provides P&L analytics with role-based access control.

## Tech Stack

- Next.js 15 (App Router) + React 19
- TypeScript
- Tailwind CSS + Radix UI
- PostgreSQL + Prisma ORM
- Auth.js / NextAuth v5 (JWT + Credentials)
- Zustand (client state)
- Zod (validation)
- Docker Compose (PostgreSQL)

## Prerequisites

- Node.js 18+
- Docker & Docker Compose (for PostgreSQL)
- npm

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/shrmadityaa/TradePilot.git
cd TradePilot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

The defaults in `.env.example` match the Docker Compose config, so you only need to replace `AUTH_SECRET` with a secure random value:

```bash
# Generate a secure secret and paste it into .env
openssl rand -base64 32
```

### 4. Start PostgreSQL

```bash
docker compose up -d
```

This starts a PostgreSQL 17 container on port 5432 with the credentials defined in `docker-compose.yml`.

### 5. Generate Prisma Client and run migrations

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 6. Start the dev server

```bash
npm run dev
```

### 7. Open the app

Visit [http://localhost:3000](http://localhost:3000), create an account, and start exploring.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run lint` | Run ESLint |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:studio` | Open Prisma Studio (DB GUI) |

## Features

### Authentication & Roles
- Email/password signup and login
- 5 user roles: Retail Investor, Trader, Learner, Analyst, Platform Admin
- Role selection at signup (Analyst and Platform Admin are admin-assigned)
- Role-based navigation and page access

### Watchlist Dashboard
- Search and add stocks to your watchlist
- Stocks grouped by market (US / Indian)
- Real-time mock price data with daily change indicators

### Stock Detail Page
- Interactive price chart with 1D, 1W, 1M, 6M, 1Y ranges
- Cursor-following crosshair with price tooltip
- Key metrics (Market Cap, P/E, EPS, Volume)
- Company profile with sector, industry, HQ, CEO
- Theme-aware (light and dark mode)

### Portfolio Management
- Add/edit/remove stock holdings (symbol, quantity, buy price, buy date)
- Per-holding gain/loss tracking
- Sector exposure breakdown

### P&L Dashboard & Analytics
- Summary cards: Total Invested, Current Value, Total P&L
- Best and worst performers
- Top gainers and losers panels
- Sector performance with allocation chart
- Full P&L breakdown table

### Admin Panel
- User management table (Platform Admin only)
- Change user roles via dropdown
- Self-role-change prevention

## Route Architecture

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing page |
| `/signup` | Public | Create account with role selection |
| `/login` | Public | Login |
| `/dashboard` | Protected | Watchlist dashboard |
| `/stocks/[symbol]` | Protected | Stock detail with chart and metrics |
| `/portfolio` | Protected | Portfolio holdings management |
| `/analytics` | Protected | P&L dashboard and analytics |
| `/admin` | Platform Admin | User management |

## Database Models

- **User** — email, password hash, role, relations to watchlist and holdings
- **Watchlist / WatchlistStock** — per-user stock tracking
- **PortfolioHolding** — holdings with quantity, buy price, buy date
- **Account / Session / VerificationToken** — Auth.js adapter models
- **UserRole** — `RETAIL_INVESTOR`, `TRADER`, `LEARNER`, `ANALYST`, `PLATFORM_ADMIN`

## Project Structure

```
├── prisma/                    # Schema and migrations
├── src/
│   ├── app/
│   │   ├── (auth)/            # Login, signup pages and actions
│   │   ├── (dashboard)/       # Dashboard, admin, portfolio, analytics, stocks
│   │   └── api/               # API routes (auth, stocks)
│   ├── components/
│   │   ├── admin/             # User management table
│   │   ├── analytics/         # P&L cards, tables, sector charts
│   │   ├── auth/              # Auth form, role selector
│   │   ├── layout/            # Dashboard shell with nav
│   │   ├── portfolio/         # Holdings form, cards, summary
│   │   ├── stocks/            # Chart, header, metrics, profile
│   │   ├── ui/                # Button, Card, Input, etc.
│   │   └── watchlist/         # Stock search, stock cards
│   ├── lib/                   # DB client, RBAC, analytics, formatters, stocks
│   ├── stores/                # Zustand stores
│   └── types/                 # TypeScript declarations
├── middleware.ts               # Auth middleware for protected routes
├── docker-compose.yml          # PostgreSQL container
└── .env.example                # Environment template
```
