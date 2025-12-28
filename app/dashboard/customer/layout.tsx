"use client";
import Layout from "@/components/ui/ul/Layout";
import { customerLinks } from "@/data/sidebarLinks";
import { useSession } from "next-auth/react";

export default function CustomerDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  return (
    <Layout
      title="Customer Dashboard"
      links={customerLinks}
      role="Customer"
      username={session?.user.name || "Customer"}
    >
      {children}
    </Layout>
  );
}
