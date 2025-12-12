"use client"
import Layout from "@/components/ul/Layout";
import { adminLinks } from "@/data/sidebarLinks";

export default function AdminDashboard({ children }: { children: React.ReactNode }) {
  return (
    <Layout
      title="Customer Dashboard"
      links={adminLinks}
      role="Admin"
      username="John Doe"
    >
      {children}
    </Layout>
  );
}
