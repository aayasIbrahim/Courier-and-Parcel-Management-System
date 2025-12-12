import AgentSidebar from "@/components/agent/Sideber";
import AgentNavbar from "@/components/agent/Navbar";

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <AgentSidebar />
      <AgentNavbar />
      <main className="pt-20 lg:ml-64 p-4">{children}</main>
    </div>
  );
}
