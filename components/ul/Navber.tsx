"use client";

import { Menu, UserCircle } from "lucide-react";

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-6">
        
        {/* Left */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            aria-label="Toggle Sidebar"
          >
            <Menu className="h-5 w-5 text-gray-700" />
          </button>

          {/* Title (truncate on mobile) */}
          <h1 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 truncate max-w-[160px] sm:max-w-none">
            {title}
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 cursor-pointer rounded-lg px-2 py-1 hover:bg-gray-100 transition">
            
            <UserCircle className="h-7 w-7 text-gray-600" />

            {/* Hide text on very small screens */}
            <div className="hidden sm:flex flex-col leading-tight text-right">
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
