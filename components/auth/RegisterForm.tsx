"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

type RegisterFormProps = {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
};

export default function RegisterForm({
  onSuccess,
  onSwitchToLogin,
}: RegisterFormProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get("name") as string,
      email: (formData.get("email") as string).toLowerCase(),
      password: formData.get("password") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
    };

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(result.message || "Registration failed");
        return;
      }

      // ✅ Success → close Drawer
      onSuccess?.();

      // Optional: redirect to OTP verify
      router.push(`/verify-otp?email=${data.email}`);
    } catch (err) {
      setLoading(false);
      setError("Server error. Please try again.");
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto rounded-2xl bg-white p-8 shadow-lg"
    >
      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          name="name"
          required
          placeholder="John Doe"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Password */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            required
            placeholder="••••••••"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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

      {/* Phone */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone (optional)
        </label>
        <input
          name="phone"
          placeholder="+8801XXXXXXXXX"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Address */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address (optional)
        </label>
        <input
          name="address"
          placeholder="Your address"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full py-2.5" disabled={loading}>
        {loading ? "Creating account..." : "Register"}
      </Button>

      {/* Footer */}
      <p className="mt-5 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => onSwitchToLogin?.()}
          className="font-medium text-blue-600 hover:underline"
        >
          Login
        </button>
      </p>
    </form>
  );
}
