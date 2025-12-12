"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { signOut } from "next-auth/react";

export interface SidebarLink {
  name: string;
  href?: string;
  icon?: React.ElementType;
  children?: SidebarLink[];
  isLogout?: boolean; // Flag for logout button
}

interface SidebarProps {
  links: SidebarLink[];
  isOpen: boolean; // For mobile toggle
  closeSidebar: () => void;
}

export default function Sidebar({ links, isOpen, closeSidebar }: SidebarProps) {
  const pathname = usePathname();
  const [dropdown, setDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) =>
    setDropdown(dropdown === name ? null : name);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-4 z-50 transform transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

        <nav className="space-y-1">
          {links.map((item) => (
            <div key={item.name}>
              {/* Single link or logout */}
              {!item.children ? (
                item.isLogout ? (
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-md hover:bg-red-100 text-red-600 w-full",
                      pathname === item.href && "bg-red-200 font-semibold"
                    )}
                  >
                    {item.icon && <item.icon className="h-5 w-5" />}
                    {item.name}
                  </button>
                ) : (
                  <Link
                    href={item.href!}
                    onClick={closeSidebar}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-md hover:bg-blue-100",
                      pathname === item.href && "bg-blue-200 font-semibold"
                    )}
                  >
                    {item.icon && <item.icon className="h-5 w-5" />}
                    {item.name}
                  </Link>
                )
              ) : (
                <>
                  {/* Dropdown button */}
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className="flex items-center justify-between w-full p-2 rounded-md hover:bg-blue-100"
                  >
                    <div className="flex items-center gap-3">
                      {item.icon && <item.icon className="h-5 w-5" />}
                      {item.name}
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        dropdown === item.name && "rotate-180"
                      )}
                    />
                  </button>

                  {/* Dropdown items */}
                  {dropdown === item.name && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children.map((sub) =>
                        sub.isLogout ? (
                          <button
                            key={sub.name}
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className={cn(
                              "block text-sm px-2 py-1 rounded hover:bg-red-100 text-red-600 w-full",
                              pathname === sub.href && "bg-red-200 font-semibold"
                            )}
                          >
                            {sub.name}
                          </button>
                        ) : (
                          <Link
                            key={sub.name}
                            href={sub.href!}
                            onClick={closeSidebar}
                            className={cn(
                              "block text-sm px-2 py-1 rounded hover:bg-gray-100",
                              pathname === sub.href && "bg-gray-200 font-semibold"
                            )}
                          >
                            {sub.name}
                          </Link>
                        )
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
