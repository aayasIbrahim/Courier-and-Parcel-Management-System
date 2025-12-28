"use client";

import { useEffect, useState } from "react";
import { User, Save, Loader2 } from "lucide-react";

interface Profile {
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
}

export default function ProfileForm() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/users/me", { credentials: "include" })
      .then((res) => res.json())
      .then(setProfile)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile) return;
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!res.ok) throw new Error();

      setMessage("Profile updated successfully ✅");
    } catch {
      setMessage("Failed to update profile ❌");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>;

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <User className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-semibold">Edit Profile</h1>
      </div>

      {message && (
        <div className="mb-4 bg-blue-100 text-blue-700 p-3 rounded">
          {message}
        </div>
      )}

      {profile && (
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          {/* Name */}
          <Input
            label="Name"
            name="name"
            value={profile.name}
            onChange={handleChange}
          />

          {/* Email (readonly) */}
          <Input label="Email" value={profile.email} disabled />

          {/* Role (readonly) */}
          <Input label="Role" value={profile.role} disabled />

          {/* Phone */}
          <Input
            label="Phone"
            name="phone"
            value={profile.phone || ""}
            onChange={handleChange}
          />

          {/* Address */}
          <Input
            label="Address"
            name="address"
            value={profile.address || ""}
            onChange={handleChange}
          />

          {/* Save Button */}
          <button
            onClick={saveProfile}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------- Small Component ---------------- */

function Input({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <label className="block text-sm text-gray-500 mb-1">{label}</label>
      <input
        {...props}
        className="w-full border rounded px-3 py-2 text-sm"
      />
    </div>
  );
}
