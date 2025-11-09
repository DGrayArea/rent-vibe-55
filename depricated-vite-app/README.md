# StudentHome - Next.js with Next-Auth & Prisma

A modern student housing platform built with Next.js, Next-Auth, Prisma, and TypeScript.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update `.env` with your database URL and generate a NextAuth secret:

```bash
# Generate NextAuth secret
openssl rand -base64 32
```

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret"
```

### 3. Set Up Database

```bash
# Generate Prisma Client
pnpm db:generate

# Push schema to database
pnpm db:push

# Or run migrations
pnpm db:migrate
```

### 4. Seed Database

```bash
pnpm db:seed
```

This creates three test users:
- **admin@example.com** / admin123456 (ADMIN role)
- **agent@example.com** / agent123456 (AGENT role)
- **student@example.com** / student123456 (STUDENT role)

### 5. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── prisma/
│   ├── schema.prisma          # Prisma schema (next-auth compatible)
│   └── seed.ts                 # Database seed script
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API routes
│   │   │   └── auth/           # Next-Auth routes
│   │   ├── auth/               # Auth pages
│   │   ├── dashboard/          # Dashboard pages
│   │   └── layout.tsx          # Root layout
│   ├── components/             # React components
│   ├── lib/                    # Utilities
│   │   ├── auth.ts             # Server-side auth helpers
│   │   └── use-role.tsx        # Client-side role hooks
│   ├── middleware.ts           # Next.js middleware for route protection
│   └── pages/                  # Page components
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
