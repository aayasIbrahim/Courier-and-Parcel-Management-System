"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import {
  Menu,
  X,
  Truck,
  Map,
  CheckCircle,
  User,
  ChevronDown,
} from "lucide-react";

const sidebarLinks = [
  { name: "Assigned Parcels", href: "/dashboard/agent", icon: Truck },

  {
    name: "Update Status",
    icon: CheckCircle,
    children: [
      { name: "Picked Up", href: "/dashboard/agent/status/picked" },
      { name: "In Transit", href: "/dashboard/agent/status/transit" },
      { name: "Delivered", href: "/dashboard/agent/status/delivered" },
      { name: "Failed", href: "/dashboard/agent/status/failed" },
    ],
  },

  { name: "Route Optimization", href: "/dashboard/agent/route", icon: Map },
  { name: "Profile", href: "/dashboard/agent/profile", icon: User },
];

export default function AgentSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) =>
    setDropdown(dropdown === name ? null : name);

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-10 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 bg-white shadow-lg h-screen w-64 p-4",
          "transform transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-64",
          "lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Agent Panel</h2>
          <button className="lg:hidden" onClick={() => setOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {sidebarLinks.map((item) => (
            <div key={item.name}>
              {!item.children ? (
                <Link
                  href={item.href!}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-md hover:bg-blue-100",
                    pathname === item.href && "bg-blue-200 font-semibold"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className="flex items-center justify-between w-full p-2 rounded-md hover:bg-blue-100"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </div>

                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        dropdown === item.name && "rotate-180"
                      )}
                    />
                  </button>

                  {dropdown === item.name && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className={cn(
                            "block text-sm px-2 py-1 rounded hover:bg-gray-100",
                            pathname === sub.href && "bg-gray-200 font-semibold"
                          )}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Mobile Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white shadow rounded-md"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </button>
    </>
  );
}
