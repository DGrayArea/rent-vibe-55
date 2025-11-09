"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Home, Search, FileText, Mail, User, LogOut } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const user = session?.user;
  const role = user?.role;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Home className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">StudentHome</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <Link
            href="/properties"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Search className="inline h-4 w-4 mr-1" />
            Search
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <FileText className="inline h-4 w-4 mr-1" />
            Blog
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Mail className="inline h-4 w-4 mr-1" />
            Contact
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          {user ? (
            <>
              {role === "STUDENT" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/dashboard")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Student
                </Button>
              )}
              {role === "AGENT" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/agent/dashboard")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Agent
                </Button>
              )}
              {role === "ADMIN" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/admin/dashboard")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/auth")}
              >
                Login
              </Button>
              <Button size="sm" onClick={() => router.push("/auth")}>
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
