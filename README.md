# Rent App - Next.js with Next-Auth & Prisma

A modern student housing platform built with Next.js 16, Next-Auth v5, Prisma, and TypeScript.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/dbname?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"
```

Generate NextAuth secret:

```bash
openssl rand -base64 32
```

### 3. Set Up Database

```bash
# Generate Prisma Client
pnpm db:generate

# Push schema to database
pnpm db:push

# Or create migration
pnpm db:migrate

# Seed database with test users
pnpm db:seed
```

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── prisma/
│   ├── schema.prisma          # Database schema (next-auth compatible)
│   └── seed.ts                 # Database seed script
├── app/                        # Next.js App Router
│   ├── api/                    # API routes
│   │   └── auth/              # Next-Auth endpoints
│   ├── auth/                   # Auth pages
│   ├── dashboard/              # Dashboard pages
│   ├── agent/                  # Agent pages
│   ├── admin/                  # Admin pages
│   └── layout.tsx              # Root layout
├── src/
│   ├── components/             # React components
│   ├── lib/                    # Utilities
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── auth.ts            # Server-side auth helpers
│   │   └── use-role.tsx       # Client-side role hooks
│   ├── pages/                  # Page components
│   ├── middleware.ts          # Next.js middleware for route protection
│   └── types/                  # TypeScript types
└── public/                     # Static assets
```

## 🔐 Authentication

This project uses **Next-Auth v5** with Prisma adapter for authentication.

### Features

- ✅ Email/password authentication
- ✅ Multi-role support (ADMIN, AGENT, STUDENT)
- ✅ Protected routes with middleware
- ✅ Server and client-side auth helpers
- ✅ Type-safe session with role information

### Using Auth on Server

```tsx
import { getCurrentUser, requireRole } from "@/lib/auth";

export default async function Page() {
  const user = await getCurrentUser();
  // or
  const session = await requireRole("ADMIN");
}
```

### Using Auth on Client

```tsx
"use client";

import { useSession } from "next-auth/react";
import { useIsAdmin } from "@/lib/use-role";

export default function Component() {
  const { data: session } = useSession();
  const isAdmin = useIsAdmin();

  return <div>{session?.user?.email}</div>;
}
```

### Protected Routes

Routes are protected using Next.js middleware. See `src/middleware.ts` for configuration.

## 🗄️ Database

The Prisma schema follows next-auth patterns:

- **User** - User accounts with roles
- **Account** - OAuth provider accounts (for future OAuth support)
- **Session** - User sessions
- **VerificationToken** - Email verification tokens

### Roles

- `ADMIN` - Full system access
- `AGENT` - Property management access
- `STUDENT` - Default user role

## 🧪 Test Users

After seeding, you can login with:

- **admin@example.com** / admin123456 (ADMIN)
- **isamubarak@example.com** / isamubarak123456 (AGENT)
- **student@example.com** / student123456 (STUDENT)

## 📝 Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm db:generate` - Generate Prisma Client
- `pnpm db:push` - Push schema to database
- `pnpm db:migrate` - Run migrations
- `pnpm db:studio` - Open Prisma Studio
- `pnpm db:seed` - Seed database

## 🚀 Production

1. Set environment variables in production
2. Run `pnpm build`
3. Start with `pnpm start`

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Next-Auth Documentation](https://authjs.dev)
- [Prisma Documentation](https://www.prisma.io/docs)
