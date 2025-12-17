"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronDown, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export interface SidebarLink {
  name: string;
  href?: string;
  icon?: React.ElementType;
  children?: SidebarLink[];
  isLogout?: boolean;
}

interface SidebarProps {
  links: SidebarLink[];
  isOpen: boolean;
  closeSidebar: () => void;
}

export default function Sidebar({
  links,
  isOpen,
  closeSidebar,
}: SidebarProps) {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) =>
    setOpenDropdown(openDropdown === name ? null : name);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200",
          "transform transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="px-4 py-5 border-b border-gray-200">
          <h2 className="text-xl font-bold tracking-tight text-gray-800">
            Courier<span className="text-blue-600">Pro</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">Management System</p>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4 space-y-1">
          {links.map((item) => {
            const isActive = pathname === item.href;

            if (!item.children) {
              // Logout
              if (item.isLogout) {
                return (
                  <button
                    key={item.name}
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="mt-6 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut className="h-5 w-5" />
                    {item.name}
                  </button>
                );
              }

              // Normal link
              return (
                <Link
                  key={item.name}
                  href={item.href!}
                  onClick={closeSidebar}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                    isActive
                      ? "bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  {item.icon && <item.icon className="h-5 w-5" />}
                  {item.name}
                </Link>
              );
            }

            // Dropdown
            return (
              <div key={item.name}>
                <button
                  onClick={() => toggleDropdown(item.name)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3">
                    {item.icon && <item.icon className="h-5 w-5" />}
                    {item.name}
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      openDropdown === item.name && "rotate-180"
                    )}
                  />
                </button>

                {openDropdown === item.name && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.children.map((sub) => {
                      const isSubActive = pathname === sub.href;

                      return sub.isLogout ? (
                        <button
                          key={sub.name}
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="flex w-full rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          {sub.name}
                        </button>
                      ) : (
                        <Link
                          key={sub.name}
                          href={sub.href!}
                          onClick={closeSidebar}
                          className={cn(
                            "block rounded-md px-3 py-2 text-sm transition",
                            isSubActive
                              ? "bg-gray-200 font-medium"
                              : "text-gray-600 hover:bg-gray-100"
                          )}
                        >
                          {sub.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
