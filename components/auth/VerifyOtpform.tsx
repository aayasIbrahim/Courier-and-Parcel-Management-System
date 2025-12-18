"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.message || "OTP verification failed");
        return;
      }

      setSuccess("✅ Account verified successfully!");
      setTimeout(() => {
        router.push("/login");
      }, 1500); // auto redirect after 1.5s
    } catch (err) {
      setLoading(false);
      setError("Server error. Please try again.");
      console.error(err);
    }
  };
  const handleResend = async () => {
    if (!email) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.message || "Failed to resend OTP");
        return;
      }

      setSuccess("✅ OTP resent successfully!");
      // Optional: start 30s cooldown before enabling again
    } catch (err) {
      setLoading(false);
      setError("Server error");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Verify Your Email
        </h2>

        <p className="text-gray-600 text-center">
          OTP sent to <span className="font-medium">{email}</span>
        </p>

        <div className="flex flex-col space-y-4">
          <input
            type="text"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg tracking-widest"
          />

          {error && (
            <p className="text-red-500 text-sm text-center font-medium">
              {error}
            </p>
          )}
          {success && (
            <p className="text-green-600 text-sm text-center font-medium">
              {success}
            </p>
          )}

          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition duration-300"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </div>

        <p className="text-gray-500 text-sm text-center">
          Didnt receive the OTP? {/* resend otp btn */}
          <button
            onClick={handleResend}
            className="text-blue-600 font-medium hover:underline disabled:text-gray-400"
          >
            Resend OTP
          </button>
        </p>
      </div>
    </div>
  );
}
