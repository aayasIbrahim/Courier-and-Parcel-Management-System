"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { verifyRole } from "@/utils/verifyRole";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
type LoginFormProps = {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
};
export default function LoginForm({
  onSuccess,
  onSwitchToRegister,
}: LoginFormProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: email.toLowerCase(),
      password,
    });

    if (res?.error) {
      setLoading(false);
      setError("Invalid email or password");
      return;
    }
    onSuccess?.();

    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();
    const role = session?.user?.role;

    setLoading(false);
    verifyRole(router, role);
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-2xl bg-white p-8 ">
      <Card className="w-full max-w-md shadow-lg">
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3 mt-5">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>

            <CardAction>
              <p className="text-sm text-center mt-4">
                Don’t have an account?{" "}
                <button
                  type="button"
                  onClick={() => onSwitchToRegister?.()}
                  className="text-blue-600 hover:underline"
                >
                  Sign up
                </button>
              </p>
            </CardAction>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
