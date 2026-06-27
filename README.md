# 🥗 Healthy Bowl — Web Platform

Full-stack web platform for a healthy fast-casual restaurant in Morocco. Customers compose personalized bowls, save dietary profiles, subscribe to monthly meal plans, and order for dine-in / takeaway / click-&-collect. Staff manage the kitchen board, menu, subscriptions, and analytics from an admin back-office.

## Tech Stack

- **Frontend:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4
- **State:** TanStack Query + Zustand (cart) + Context (toast)
- **Auth:** NextAuth.js v4 (JWT, email/password)
- **DB:** PostgreSQL + Prisma 7 (with `@prisma/adapter-pg`)
- **Realtime:** Polling SSE for kitchen board (upgradeable to WebSocket)
- **Validation:** Zod v4

## Prerequisites

- Node.js 20+
- PostgreSQL 15+ running locally

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env` and fill in your values:

```bash
# .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/healthy_bowl"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Create the database

```bash
createdb healthy_bowl
# or via psql:
psql -U postgres -c "CREATE DATABASE healthy_bowl;"
```

### 4. Generate Prisma client & migrate

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Seed demo data

```bash
npm run seed
```

This creates:
- 1 location (Marrakech campus)
- 25 ingredients with full macros/allergens
- 12 menu items across 4 categories
- 4 subscription plan configs
- 5 demo accounts (see below)
- 2 partners, 2 promo codes, loyalty accounts

### 6. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Accounts

All passwords: `HealthyBowl123!`

| Email | Role | Notes |
|-------|------|-------|
| `admin@healthybowl.ma` | Admin | Full access |
| `manager@healthybowl.ma` | Manager | Menu, orders, reports |
| `staff@healthybowl.ma` | Staff | Kitchen board only |
| `client@example.com` | Customer | Active subscription |
| `etudiant@example.com` | Customer | Verified student |

## Key Routes

### Public
- `/` — Landing page
- `/menu` — Full menu (4 categories, filters)
- `/builder` — Bowl Builder wizard (7 steps, live macros)
- `/abonnements` — Subscription plans

### Auth
- `/login` + `/register`

### Customer (`/compte/*`)
- `/compte/profil-alimentaire` — Dietary profile (goals, allergens, exclusions)
- `/compte/commandes` — Order history
- `/compte/abonnement` — Manage subscription
- `/compte/fidelite` — Loyalty points

### Admin (`/admin/*`, requires staff+)
- `/admin/cuisine` — **Live kitchen board** (polls every 3s, prep timers, status transitions)
- `/admin/commandes` — All orders with filters
- `/admin/menu` — Menu CRUD
- `/admin/ingredients` — Ingredient manager with stock levels

## Kitchen Board — Realtime Demo

1. Login as `staff@healthybowl.ma`
2. Navigate to `/admin/cuisine`
3. In another tab, place an order via the checkout flow
4. The kitchen board auto-refreshes every 3 seconds and new orders pulse green
5. Click "Commencer prépa" → "Marquer prête" to transition statuses
6. Prep timer turns red after 7 minutes

## Promo Codes

- `WELCOME20` — 20% off (first order)
- `ETUDIANT15` — 15% off (student discount)

## Project Structure

```
src/
  app/                   # Next.js App Router pages + API routes
    (auth pages)         # login, register
    admin/               # Back-office (kitchen, menu, orders, clients)
    api/                 # Route handlers
    builder/             # Bowl Builder wizard
    checkout/            # Cart → checkout → confirmation
    compte/              # Customer account area
    menu/                # Public menu
  components/
    ui/                  # Button, Card, Badge, Input, Toast, NutritionLabel
    layout/              # Header, Footer
    bowl-builder/        # Builder wizard steps
  generated/prisma/      # Generated Prisma 7 client
  lib/                   # prisma.ts, auth.ts, utils.ts, validations.ts
  store/                 # cart.tsx (Zustand-style context)
  types/                 # next-auth.d.ts

prisma/
  schema.prisma          # Full data model (18 models, 14 enums)
  seed.ts                # Demo data seed
```

## Build

```bash
npm run build
```

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Yes | JWT signing secret (min 32 chars) |
| `NEXTAUTH_URL` | Yes | App base URL |
| `NEXT_PUBLIC_APP_URL` | No | Public URL (same as NEXTAUTH_URL) |
| `EMAIL_FROM` | No | Transactional email sender |
| `STRIPE_SECRET_KEY` | No | Payment (phase 2) |

## Phase Roadmap

- **Phase 1 (done):** Foundation, design system, auth, DB schema
- **Phase 2 (done):** Public site, menu, bowl builder, checkout, subscriptions
- **Phase 3 (done):** Customer accounts, loyalty, referral, admin back-office, kitchen board
- **Phase 4 (next):** Inventory management, newsletter engine, analytics reports, staff HR
- **Phase 5:** Delivery integration, multi-location, nutritionist booking (Premium)
- **Phase 6:** Native PWA, push notifications, Arabic locale
