"use client";

import { useEffect, useState } from "react";
import { Settings, Save } from "lucide-react";

interface AdminSettings {
  companyName: string;
  supportEmail: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSettings>({
    companyName: "",
    supportEmail: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings", { credentials: "include" });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setSettings(data);
      } catch {
        setMessage("Failed to load settings ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const saveSettings = async () => {
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error();
      setMessage("Settings saved successfully ✅");
    } catch {
      setMessage("Failed to save settings ❌");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Loading settings...</p>;

  return (
    <div className="p-4 md:p-6 max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-semibold">Admin Settings</h1>
      </div>

      {/* Messages */}
      {message && (
        <div className="bg-blue-100 text-blue-700 p-3 rounded">{message}</div>
      )}

      {/* Settings Form */}
      <div className="bg-white shadow rounded p-5 space-y-4">
        <div>
          <label className="text-sm text-gray-600">Company Name</label>
          <input
            className="w-full border px-3 py-2 rounded mt-1"
            value={settings.companyName}
            onChange={(e) =>
              setSettings({ ...settings, companyName: e.target.value })
            }
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Support Email</label>
          <input
            className="w-full border px-3 py-2 rounded mt-1"
            value={settings.supportEmail}
            onChange={(e) =>
              setSettings({ ...settings, supportEmail: e.target.value })
            }
          />
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={saveSettings}
        disabled={saving}
        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        <Save className="h-4 w-4" />
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
}
