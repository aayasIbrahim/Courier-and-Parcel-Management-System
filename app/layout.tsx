import type { Metadata } from "next";

import "./globals.css";
import { Providers } from "@/providers/Providers";


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
          
          {children}
          
        </Providers>
      </body>
    </html>
  );
}
