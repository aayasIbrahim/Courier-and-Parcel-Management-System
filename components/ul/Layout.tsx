"use client";

import { useState } from "react";
import Sidebar, { SidebarLink } from "./Sidebar";
import Navbar from "@/components/ul/Navber";

interface LayoutProps {
  title: string;               // Dashboard title
  links: SidebarLink[];        // Sidebar links
  role?: string;               // User role
  username?: string;           // User name
  children: React.ReactNode;
}

export default function Layout({ title, links, role, username, children }: LayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen ">
      {/* Navbar */}
      <Navbar
        title={title}
        role={role}
        username={username}
        toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
      />

      {/* Sidebar */}
      <Sidebar
        links={links}
        isOpen={isSidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <main className=" md:ml-64 p-4 transition-all duration-300 mt-9">
        {children}
      </main>
    </div>
  );
}
