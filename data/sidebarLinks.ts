import {
  Truck,
  LogOut,
  CheckCircle,
  Map,
  User,
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  List,
  Package,
} from "lucide-react";

export const agentLinks = [
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
  { name: "Logout", href: "#", icon: LogOut, isLogout: true }
];

export const adminLinks = [
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
  { name: "Logout", href: "#", icon: LogOut, isLogout: true },
];

export const customerLinks = [
  { name: "My Parcels", href: "/dashboard/customer", icon: List },
  { name: "Book Parcel", href: "/dashboard/customer/book", icon: Package },
  { name: "Track Parcel", href: "/dashboard/customer/track", icon: Map },
  { name: "Profile", href: "/dashboard/customer/profile", icon: User },
  { name: "Logout", href: "#", icon: LogOut, isLogout: true },
];
