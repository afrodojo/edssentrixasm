import React, { useState } from "react";
import { LayoutDashboard, Building2, KeyRound, Server, GitBranch, Shield, Users, Lock, Bell, CheckCircle2, X } from "lucide-react";
import AdminDashboardOverview from "../components/admin/AdminDashboardOverview";
import OrgOverview from "../components/admin/OrgOverview";
import LicenseManager from "../components/admin/LicenseManager";
import InfraManager from "../components/admin/InfraManager";
import SDLCTracker from "../components/admin/SDLCTracker";
import RBACMatrix from "../components/admin/RBACMatrix";
import { toast } from "sonner";

const tabs = [
  { id: "overview",  label: "Overview",       icon: LayoutDashboard },
  { id: "orgs",      label: "Organizations",  icon: Building2 },
  { id: "licenses",  label: "Licenses",       icon: KeyRound },
  { id: "infra",     label: "Infrastructure", icon: Server },
  { id: "sdlc",      label: "SDLC Projects",  icon: GitBranch },
  { id: "rbac",      label: "Access Control", icon: Shield },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Admin Control Center</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage organizations, licenses, infrastructure, billing & client SDLCs
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-tactical-gold/10 border border-tactical-gold/20 rounded-xl text-xs font-bold text-tactical-gold">
          <Shield className="w-4 h-4" />
          Admin Only
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0.5 overflow-x-auto border-b border-border/60 pb-0 scrollbar-none">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors -mb-px whitespace-nowrap shrink-0 ${
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

      {/* Tab Content */}
      {activeTab === "overview"  && <AdminDashboardOverview />}
      {activeTab === "orgs"      && <OrgOverview />}
      {activeTab === "licenses"  && <LicenseManager />}
      {activeTab === "infra"     && <InfraManager />}
      {activeTab === "sdlc"      && <SDLCTracker />}
      {activeTab === "rbac"      && (
        <div className="space-y-4">
          <RBACMatrix />
          {/* Security Policy */}
          <div className="bg-card border border-border/60 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-tactical-gold" />
              <h3 className="font-bold text-foreground">Zero Trust Security Policy</h3>
            </div>
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
    </div>
  );
}