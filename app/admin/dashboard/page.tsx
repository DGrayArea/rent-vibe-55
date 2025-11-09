import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import AdminDashboard from "@/components/pages/AdminDashboard";

export default async function AdminDashboardPage() {
  try {
    await requireRole("ADMIN");
    return <AdminDashboard />;
  } catch {
    redirect("/dashboard");
  }
}

