import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import AgentDashboard from "@/components/pages/AgentDashboard";

export default async function AgentDashboardPage() {
  try {
    await requireRole("AGENT");
    return <AgentDashboard />;
  } catch {
    redirect("/dashboard");
  }
}

