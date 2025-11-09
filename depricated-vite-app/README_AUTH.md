# Authentication Setup with Prisma & Next-Auth Patterns

This project uses Prisma with PostgreSQL and follows next-auth patterns for authentication with multi-role support.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env` and fill in your database URL:

```bash
cp .env.example .env
```

Update `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
PORT=3001
CLIENT_URL="http://localhost:8080"
VITE_API_URL="http://localhost:3001"
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

### 5. Run Development Servers

```bash
pnpm dev
```

This runs both:

- Frontend (Vite) on http://localhost:8080
- Backend API on http://localhost:3001

## 📁 Project Structure

```
├── prisma/
│   ├── schema.prisma          # Prisma schema (next-auth compatible)
│   └── seed.ts                 # Database seed script
├── server/
│   ├── index.ts                # Express server
│   └── routes/
│       └── auth.ts             # Auth API routes
└── src/
    └── lib/
        ├── auth.tsx            # Auth context provider
        ├── auth-client.ts       # API client
        └── use-role.tsx         # Role hooks
```

## 🔐 Authentication

### Using the Auth Hook

```tsx
import { useAuth } from "@/lib/auth";

function MyComponent() {
  const { user, roles, loading, signIn, signOut, hasRole } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;

  return (
    <div>
      <p>Welcome, {user.email}</p>
      {hasRole("ADMIN") && <p>You are an admin</p>}
    </div>
  );
}
```

### Protected Routes

```tsx
import { ProtectedRoute } from "@/components/ProtectedRoute";

<Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute requiredRole="ADMIN">
      <AdminDashboard />
    </ProtectedRoute>
  }
/>;
```

### Role Hooks

```tsx
import { useIsAdmin, useIsAgent, useIsStudent } from "@/lib/use-role";

function MyComponent() {
  const isAdmin = useIsAdmin();
  const isAgent = useIsAgent();
  const isStudent = useIsStudent();
}
```

## 🗄️ Database Schema

The Prisma schema follows next-auth patterns:

- **User** - User accounts with roles
- **Account** - OAuth provider accounts (for future OAuth support)
- **Session** - User sessions
- **VerificationToken** - Email verification tokens

### Roles

- `ADMIN` - Full system access
- `AGENT` - Property management access
- `STUDENT` - Default user role

## 🔧 API Endpoints

- `POST /api/auth/signup` - Create new user
- `POST /api/auth/signin` - Sign in
- `GET /api/auth/session` - Get current session
- `POST /api/auth/signout` - Sign out

## 📝 Notes

- This setup follows next-auth patterns but works with Vite/React
- For full next-auth support, consider migrating to Next.js
- The backend API server handles all authentication logic
- Sessions are stored in cookies (httpOnly, secure in production)

## 🚀 Production

1. Set `NODE_ENV=production`
2. Use a secure `DATABASE_URL`
3. Set proper `CLIENT_URL` for CORS
4. Use HTTPS for secure cookies
