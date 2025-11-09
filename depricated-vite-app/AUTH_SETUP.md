# Authentication Setup Guide

This project uses Supabase for authentication with a multi-role system similar to next-auth. The system supports three roles: **admin**, **agent**, and **student**.

## Features

- ✅ Email/password authentication
- ✅ Multi-role support (admin, agent, student)
- ✅ Protected routes with role-based access control
- ✅ Automatic role assignment (default: student)
- ✅ Auth context provider (similar to next-auth's session pattern)

## Setup

### 1. Environment Variables

Make sure you have the following environment variables in your `.env.local` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Only needed for seed script
```

### 2. Database Migrations

Run the database migrations to set up the role system:

```bash
# If using Supabase CLI
supabase db push

# Or apply migrations manually in your Supabase dashboard
```

The migrations include:

- `user_roles` table with role enum (admin, agent, student)
- RLS policies for role management
- Automatic role assignment trigger (assigns "student" role by default)

### 3. Seed Test Users

To create test users with different roles, run:

```bash
npm run seed
# or
bun run seed
```

This will create three test users:

- **admin@example.com** / admin123456 (admin role)
- **agent@example.com** / agent123456 (agent role)
- **student@example.com** / student123456 (student role)

## Usage

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
      {hasRole("admin") && <p>You are an admin</p>}
    </div>
  );
}
```

### Using Role Hooks

```tsx
import { useIsAdmin, useIsAgent, useIsStudent } from "@/lib/use-role";

function MyComponent() {
  const isAdmin = useIsAdmin();
  const isAgent = useIsAgent();
  const isStudent = useIsStudent();

  // ...
}
```

### Protected Routes

Use the `ProtectedRoute` component to protect routes:

```tsx
import { ProtectedRoute } from "@/components/ProtectedRoute";

<Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  }
/>;
```

### Sign Up / Sign In

The `Auth` page handles both sign up and sign in. New users are automatically assigned the "student" role by default.

To assign a different role during signup (admin only):

```tsx
const { signUp } = useAuth();
await signUp(email, password, "agent"); // or "admin", "student"
```

## Role Management

### Assigning Roles

Only admins can assign roles. Use the Supabase dashboard or create an admin interface to manage user roles.

### Checking Roles

```tsx
const { hasRole, hasAnyRole } = useAuth();

// Check single role
if (hasRole("admin")) {
  // User is admin
}

// Check multiple roles
if (hasAnyRole(["admin", "agent"])) {
  // User is either admin or agent
}
```

## Database Schema

### user_roles Table

```sql
create table public.user_roles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    role app_role not null,
    created_at timestamp with time zone default now(),
    unique (user_id, role)
);
```

### Roles Enum

```sql
create type public.app_role as enum ('admin', 'agent', 'student');
```

## Security

- Row Level Security (RLS) is enabled on the `user_roles` table
- Users can only view their own roles
- Only admins can create, update, or delete roles
- Protected routes automatically redirect unauthorized users

## Migration from Existing Auth

If you're migrating from the old auth system:

1. The new system is backward compatible
2. Existing users will need roles assigned manually
3. Use the seed script as a reference for assigning roles
4. The `ProtectedRoute` component replaces manual auth checks in components
