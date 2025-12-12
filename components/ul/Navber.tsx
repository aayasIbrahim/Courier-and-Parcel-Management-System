"use client";

import { Menu, Bell, UserCircle } from "lucide-react";

interface NavbarProps {
  title: string;                 // Page or dashboard title
  role?: string;                 // User role
  toggleSidebar: () => void;     // Function to open/close sidebar
  username?: string;             // Display user name
}

export default function Navbar({
  title,
  role,
  toggleSidebar,
  username,
}: NavbarProps) {
  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-4 md:px-6 fixed top-0 left-0 right-0 z-50">
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <Menu
          className="h-6 w-6 cursor-pointer md:hidden"
          onClick={toggleSidebar}
        />
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <Bell className="h-6 w-6 cursor-pointer" />

        {/* User info */}
        <div className="flex items-center gap-2 cursor-pointer">
          <UserCircle className="h-7 w-7" />
          <div className="hidden sm:flex flex-col">
            <span className="font-medium">{username ?? "User"}</span>
            {role && <span className="text-xs text-gray-500">{role}</span>}
          </div>
        </div>
      </div>
    </header>
  );
}
