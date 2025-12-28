"use client";
import Layout from "@/components/ui/ul/Layout";
import { agentLinks } from "@/data/sidebarLinks";
import { useSession } from "next-auth/react";

export default function AgentDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  return (
    <Layout
      title="Agent Dashboard"
      links={agentLinks}
      role="Agent"
      username={session?.user.name || "Agent"}
    >
      {children}
    </Layout>
  );
}
