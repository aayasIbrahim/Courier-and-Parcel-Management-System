'use client'

import { useState } from "react";
import Navbar from "@/components/ul/Navber";
import Sidebar from "@/components/ul/Sidebar";
import { customerLinks } from "@/data/sidebarLinks";

export default function CustomerDashboard({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-gray-100">
      <Navbar
        title="Customer Dashboard"
        role="Customer"
        username="John Doe"
        toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
      />

      <Sidebar
        links={customerLinks}
        isOpen={isSidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />

      <main className="pt-16 md:ml-64 p-4">{children}</main>
    </div>
  );
}
