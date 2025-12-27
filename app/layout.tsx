import type { Metadata } from "next";

import "./globals.css";
import { Providers } from "@/providers/Providers";
import Nav from "@/components/ul/Nav";
import Footer from "@/components/ul/Footer";

export const metadata: Metadata = {
  title: "Courier Management System",
  description: "Manage your couriers efficiently and effectively.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
     <body className="flex flex-col min-h-screen antialiased ...">
  <Providers>
    <Nav />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </Providers>
</body>
    </html>
  );
}
