"use client";

import { useSession } from "next-auth/react";
import type { Role } from "@prisma/client";

/**
 * Hook to check if the current user has a specific role
 * Similar to next-auth's role checking pattern
 */
export function useRole(role: Role): boolean {
  const { data: session } = useSession();
  return session?.user?.role === role;
}

/**
 * Hook to check if the current user has any of the specified roles
 */
export function useAnyRole(roles: Role[]): boolean {
  const { data: session } = useSession();
  if (!session?.user?.role) return false;
  return roles.includes(session.user.role);
}

/**
 * Hook to check if the current user is an admin
 */
export function useIsAdmin(): boolean {
  return useRole("ADMIN");
}

/**
 * Hook to check if the current user is an agent
 */
export function useIsAgent(): boolean {
  return useRole("AGENT");
}

/**
 * Hook to check if the current user is a student
 */
export function useIsStudent(): boolean {
  return useRole("STUDENT");
}
