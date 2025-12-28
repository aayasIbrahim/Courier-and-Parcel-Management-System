"use client";

import React, { useState } from "react";
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

function AuthDrawer() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      {/* Trigger Button */}
      <DrawerTrigger asChild>
        <Button
          onClick={() => setAuthMode("login")}
          className="bg-black text-white hover:bg-gray-700"
        >
          Log In
        </Button>
      </DrawerTrigger>

      {/* Drawer Content */}
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
              className="absolute right-6 top-6 text-black p-2 rounded-md hover:bg-gray-100"
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
  );
}

export default AuthDrawer;
