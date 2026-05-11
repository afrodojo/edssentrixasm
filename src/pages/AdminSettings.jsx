import React, { useState } from "react";
import { Shield, Users, Bell, Lock, CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";
import RBACMatrix from "../components/admin/RBACMatrix";

const tabs = [
  { id: "rbac", label: "Roles & Permissions", icon: Users },
  { id: "security", label: "Security Policy", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
];

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("rbac");

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Admin Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage platform access, roles, and security policies</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border/60 pb-0">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors -mb-px ${
              activeTab === t.id
                ? "border-tactical-gold text-tactical-gold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "rbac" && <RBACMatrix />}

      {activeTab === "security" && (
        <div className="space-y-4">
          <div className="bg-card border border-border/60 rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-foreground">Zero Trust Security Policy</h3>
            {[
              { label: "Enforce MFA for all users", enabled: true },
              { label: "Session timeout after 15 minutes of inactivity", enabled: true },
              { label: "Require re-authentication to view PII", enabled: true },
              { label: "Log all PII access events", enabled: true },
              { label: "Block access from non-approved IP ranges", enabled: false },
              { label: "Enforce Cloudflare Zero Trust gateway", enabled: true },
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <span className="text-sm text-foreground">{p.label}</span>
                <div className={`flex items-center gap-1.5 text-xs font-bold ${p.enabled ? "text-emerald-400" : "text-muted-foreground"}`}>
                  {p.enabled ? <CheckCircle2 className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  {p.enabled ? "Enabled" : "Disabled"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="bg-card border border-border/60 rounded-xl p-6">
          <p className="text-sm text-muted-foreground">Notification settings coming soon.</p>
        </div>
      )}
    </div>
  );
}