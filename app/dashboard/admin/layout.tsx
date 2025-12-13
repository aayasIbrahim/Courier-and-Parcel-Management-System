"use client";
import Layout from "@/components/ul/Layout";
import {adminLinks } from "@/data/sidebarLinks";
import { useSession } from "next-auth/react";

export default function AdminDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  return (
    <Layout
      title="Admin Dashboard"
      links={adminLinks}
      role="Admin"
      username={session?.user.name|| "Admin"}
    >
      {children}
    </Layout>
  );
}