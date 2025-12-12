import Layout from "@/components/ul/Layout";
import { agentLinks } from "@/data/sidebarLinks";

export default function AgentDashboard({ children }: { children: React.ReactNode }) {
  return (
    <Layout
      title="Admin Dashboard"
      links={agentLinks}
      role="Agent"
      username="John Doe"
    >
      {children}
    </Layout>
  );
}
