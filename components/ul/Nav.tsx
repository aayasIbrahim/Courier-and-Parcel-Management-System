"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import LoginForm from "../auth/LoginForm";
import RegisterForm from "../auth/RegisterForm";

function Nav() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isScrolled, setIsScrolled] = useState(false);

  // Navbar hide/show on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 bg-white shadow-md transition-transform duration-300 ${
        isScrolled ? "shadow-lg" : "shadow-md"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-black">
          CourierPro
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-6 text-gray-700 font-medium">
          <Link href="/">Home</Link>
          <Link href="/services">Services</Link>
          <Link href="/tracking">Tracking</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        {/* Login/Register Button */}
        <div className="hidden lg:block">
          <Button
            onClick={() => {
              setIsDrawerOpen(true);
              setAuthMode("login");
            }}
            className="bg-black text-white hover:bg-gray-700"
          >
            Log In
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <div className="lg:hidden">
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <Button className="bg-blue-600 text-white p-2 rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </Button>
            </DrawerTrigger>

            <DrawerContent className="w-screen h-screen max-w-none p-0">
              <div className="flex flex-col w-full h-full">
                <DrawerHeader className="px-6 pt-6">
                  <DrawerTitle className="text-2xl">
                    {authMode === "login"
                      ? "Login to your account"
                      : "Create a new account"}
                  </DrawerTitle>
                  <DrawerDescription className="mt-1 text-sm text-gray-500">
                    {authMode === "login"
                      ? "Enter your credentials to continue"
                      : "Fill in the details to sign up"}
                  </DrawerDescription>
                </DrawerHeader>

                <DrawerClose asChild>
                  <button
                    className="absolute right-6 top-6 text-black rounded-md p-2 hover:bg-gray-100"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </DrawerClose>

                <div className="flex-grow overflow-auto px-6 py-4 flex flex-col items-center justify-center gap-6">
                  {authMode === "login" ? (
                    <LoginForm
                      onSuccess={() => setIsDrawerOpen(false)}
                      onSwitchToRegister={() => setAuthMode("register")}
                    />
                  ) : (
                    <RegisterForm
                      onSuccess={() => setIsDrawerOpen(false)}
                      onSwitchToLogin={() => setAuthMode("login")}
                    />
                  )}
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
}

export default Nav;
