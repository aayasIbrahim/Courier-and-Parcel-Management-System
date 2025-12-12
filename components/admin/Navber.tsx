"use client";

import { Bell, UserCircle } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-6 lg:ml-64 fixed top-0 left-0 right-0 z-40">
      <h1 className="text-lg lg:text-xl font-semibold">Admin Dashboard</h1>

      <div className="flex items-center gap-6">
        <Bell className="h-6 w-6 cursor-pointer" />
        <div className="flex items-center gap-2 cursor-pointer">
          <UserCircle className="h-7 w-7" />
          <span className="font-medium hidden sm:block">Admin</span>
        </div>
      </div>
    </header>
  );
}
