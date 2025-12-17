"use client";

import { Menu, Bell, UserCircle } from "lucide-react";

interface NavbarProps {
  title: string;
  role?: string;
  toggleSidebar: () => void;
  username?: string;
}

export default function Navbar({
  title,
  role,
  toggleSidebar,
  username,
}: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-gray-200">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            aria-label="Toggle Sidebar"
          >
            <Menu className="h-5 w-5 text-gray-700" />
          </button>

          <h1 className="text-lg md:text-xl font-semibold text-gray-800">
            {title}
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {/* Notification */}
          {/* <button className="relative p-2 rounded-lg hover:bg-gray-100 transition">
            <Bell className="h-5 w-5 text-gray-700" />
            {/* Badge */}
            {/* <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" /> */}
          {/* </button>  */}

          {/* User */}
          <div className="flex items-center gap-2 cursor-pointer rounded-lg px-2 py-1 hover:bg-gray-100 transition">
            <UserCircle className="h-7 w-7 text-gray-600" />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-sm font-medium text-gray-800">
                {username ?? "User"}
              </span>
              {role && (
                <span className="text-xs text-gray-500 capitalize">
                  {role}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
