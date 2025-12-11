"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value.toLowerCase(),
      password: e.target.password.value,
      phone: e.target.phone.value,
      address: e.target.address.value,
    };

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message || "Registration failed");
      return;
    }

    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-4">Create an Account</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-3">{error}</div>
        )}

        <input
          name="name"
          placeholder="Full Name"
          className="w-full p-2 border rounded mb-3"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-3"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-3"
          required
        />

        <input
          name="phone"
          placeholder="Phone Number"
          className="w-full p-2 border rounded mb-3"
        />

        <input
          name="address"
          placeholder="Address"
          className="w-full p-2 border rounded mb-3"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded mt-2"
          disabled={loading}
        >
          {loading ? "Creating..." : "Register"}
        </button>

        <p className="text-sm mt-3 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
