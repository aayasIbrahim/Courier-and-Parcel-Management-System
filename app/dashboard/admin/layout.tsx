import Sidebar from "@/components/admin/Sidebar";
import Navbar from "@/components/admin/Navber";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <Navbar />
      <main className="pt-20 lg:ml-64 p-4">{children}</main>
    </div>
  );
}
