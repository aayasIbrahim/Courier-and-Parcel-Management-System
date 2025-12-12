"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import {
  Menu,
  X,
  LayoutDashboard,
  Truck,
  Users,
  FileText,
  Settings,
  ChevronDown,
} from "lucide-react";

const sidebarLinks = [
  { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
  {
    name: "Parcels",
    icon: Truck,
    children: [
      { name: "All Parcels", href: "/dashboard/admin/parcels" },
      { name: "Pending", href: "/dashboard/admin/parcels/pending" },
      { name: "Delivered", href: "/dashboard/admin/parcels/delivered" },
      { name: "Failed", href: "/dashboard/admin/parcels/failed" },
      { name: "Assign Agents", href: "/dashboard/admin/assign" },
    ],
  },
  {
    name: "Users",
    icon: Users,
    children: [
      { name: "All Users", href: "/dashboard/admin/users" },
      { name: "Agents", href: "/dashboard/admin/users/agents" },
      { name: "Customers", href: "/dashboard/admin/users/customers" },
    ],
  },
  { name: "Reports", href: "/dashboard/admin/reports", icon: FileText },
  { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false); // for mobile
  const [dropdown, setDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setDropdown(dropdown === name ? null : name);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 bg-white shadow-lg h-screen w-64 p-4 transform transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-64",
          "lg:translate-x-0"
        )}
      >
        {/* Logo + Close Button (Mobile) */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <button className="lg:hidden" onClick={() => setOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="space-y-1">
          {sidebarLinks.map((item) => (
            <div key={item.name}>
              {/* Normal Link (no children) */}
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
                  {/* Dropdown Parent */}
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className={cn(
                      "flex items-center justify-between w-full p-2 rounded-md hover:bg-blue-100"
                    )}
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

                  {/* Dropdown Children */}
                  {dropdown === item.name && (
                    <div className="ml-8 mt-1 space-y-1 animate-fadeIn">
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

      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white shadow rounded-md"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </button>
    </>
  );
}
