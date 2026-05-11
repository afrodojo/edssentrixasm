import React, { useState } from "react";
import { Download, ShieldAlert, Filter, Search, CheckCircle2, Eye, FileText, Lock, AlertTriangle, LogIn } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const logs = [
  { id: 1, time: "09:02 AM", user: "J. Doe", action: "Viewed Court Document PII", resource: "Case #4421", ip: "192.168.1.10", severity: "high", icon: Eye },
  { id: 2, time: "09:15 AM", user: "M. Carter", action: "Dispatched Legal Notary", resource: "Dispatch #D-2891", ip: "192.168.1.22", severity: "info", icon: FileText },
  { id: 3, time: "09:31 AM", user: "A. Williams", action: "Login — MFA Passed", resource: "Auth", ip: "10.0.0.45", severity: "success", icon: LogIn },
  { id: 4, time: "09:44 AM", user: "J. Doe", action: "Exported Compliance Report", resource: "SOC 2 Report", ip: "192.168.1.10", severity: "warn", icon: Download },
  { id: 5, time: "10:02 AM", user: "T. Hassan", action: "Failed Login Attempt (x3)", resource: "Auth", ip: "45.33.91.2", severity: "critical", icon: AlertTriangle },
  { id: 6, time: "10:11 AM", user: "M. Carter", action: "Updated RBAC Permissions", resource: "User: R. Singh", ip: "192.168.1.22", severity: "warn", icon: Lock },
  { id: 7, time: "10:28 AM", user: "R. Singh", action: "Requested Aerial Drone Ops", resource: "Mission #AO-091", ip: "10.0.0.61", severity: "info", icon: FileText },
  { id: 8, time: "10:45 AM", user: "J. Doe", action: "Viewed Client Address PII", resource: "EP Case #EP-007", ip: "192.168.1.10", severity: "high", icon: Eye },
  { id: 9, time: "11:02 AM", user: "A. Williams", action: "Session Timeout — Auto-Locked", resource: "Auth", ip: "10.0.0.45", severity: "info", icon: Lock },
  { id: 10, time: "11:15 AM", user: "T. Hassan", action: "Account Locked — Admin Notified", resource: "Auth", ip: "45.33.91.2", severity: "critical", icon: ShieldAlert },
];

const severityConfig = {
  critical: { label: "Critical", classes: "bg-red-500/10 text-red-400 border-red-500/20", dot: "bg-red-500" },
  high: { label: "High", classes: "bg-orange-500/10 text-orange-400 border-orange-500/20", dot: "bg-orange-400" },
  warn: { label: "Warning", classes: "bg-tactical-gold/10 text-tactical-gold border-tactical-gold/20", dot: "bg-tactical-gold" },
  info: { label: "Info", classes: "bg-blue-500/10 text-blue-400 border-blue-500/20", dot: "bg-blue-400" },
  success: { label: "Success", classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", dot: "bg-emerald-400" },
};

const today = "May 11, 2026";

export default function AuditLogs() {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");

  const filtered = logs.filter(l => {
    const matchSearch = l.user.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.ip.includes(search);
    const matchSev = severityFilter === "all" || l.severity === severityFilter;
    return matchSearch && matchSev;
  });

  const handleDownload = () => {
    toast.success("Generating SOC 2 / NIST Compliance Report... Download will begin shortly.");
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Security &amp; Audit Logs</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Immutable activity log — NIST SP 800-53 / SOC 2 Type II compliant</p>
        </div>
        <Button onClick={handleDownload} className="gap-2 bg-tactical-gold hover:bg-tactical-amber text-navy-900 font-bold w-fit">
          <Download className="w-4 h-4" />
          Download Compliance Report
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Critical Events", value: "2", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
          { label: "High Risk", value: "2", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
          { label: "PII Accessed", value: "2", color: "text-tactical-gold", bg: "bg-tactical-gold/10 border-tactical-gold/20" },
          { label: "Total Events Today", value: logs.length.toString(), color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
        ].map((s, i) => (
          <div key={i} className={`p-4 rounded-xl border ${s.bg}`}>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search user, action, IP..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 h-10" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {["all", "critical", "high", "warn", "info", "success"].map(s => (
            <Button key={s} size="sm" variant={severityFilter === s ? "default" : "outline"} onClick={() => setSeverityFilter(s)} className="text-xs capitalize">
              {s === "all" ? "All" : severityConfig[s]?.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Log table */}
      <div className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm">
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-muted/40 border-b border-border/60 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <div className="col-span-1">Time</div>
          <div className="col-span-2">User</div>
          <div className="col-span-4">Action</div>
          <div className="col-span-2">Resource</div>
          <div className="col-span-2">IP Address</div>
          <div className="col-span-1">Severity</div>
        </div>
        <div className="divide-y divide-border/40">
          {filtered.map(log => {
            const sev = severityConfig[log.severity];
            const Icon = log.icon;
            return (
              <div key={log.id} className="grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-4 px-5 py-3.5 hover:bg-muted/20 transition-colors text-sm">
                <div className="md:col-span-1 text-muted-foreground font-mono text-xs">{log.time}</div>
                <div className="md:col-span-2 font-semibold text-foreground flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${sev.dot}`} />
                  {log.user}
                </div>
                <div className="md:col-span-4 text-foreground flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  {log.action}
                </div>
                <div className="md:col-span-2 text-muted-foreground text-xs font-mono">{log.resource}</div>
                <div className="md:col-span-2 text-muted-foreground text-xs font-mono">{log.ip}</div>
                <div className="md:col-span-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${sev.classes}`}>
                    {sev.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer note */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span>All log entries are cryptographically signed and immutable. Last sync: {today} · 11:15 AM</span>
      </div>
    </div>
  );
}