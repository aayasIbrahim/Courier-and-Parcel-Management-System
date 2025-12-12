import Layout from "@/components/ul/Layout";
import { customerLinks } from "@/data/sidebarLinks";

export default function CustomerDashboard({ children }: { children: React.ReactNode }) {
  return (
    <Layout
      title="Customer Dashboard"
      links={customerLinks}
      role="Customer"
      username="John Doe"
    >
      {children}
    </Layout>
  );
}
