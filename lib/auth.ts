import type { Role } from "@prisma/client";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function getSession() {
  return await auth();
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function requireRole(role: Role) {
  const session = await requireAuth();
  if (session.user.role !== role) {
    throw new Error("Forbidden");
  }
  return session;
}
