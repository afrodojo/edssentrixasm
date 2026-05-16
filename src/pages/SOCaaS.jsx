import React, { useState, useEffect } from "react";
import { Shield, AlertTriangle, Activity, Wifi, Monitor, Server, Globe, ZapOff, ShieldAlert, Radio, CheckCircle2, XCircle, Clock, ChevronRight, Database, Search, Lock, Cpu, FileSearch, Bell, Network, Eye, BarChart2, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ThreatMap from "../components/socaas/ThreatMap";
import LiveAlertsFeed from "../components/socaas/LiveAlertsFeed";
import ThyreosPanel from "../components/socaas/ThyreosPanel";

const stats = [
  { label: "Threats Blocked (24h)", value: "1,247", delta: "+18%", icon: Shield, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  { label: "Active Endpoints", value: "34", delta: "All Online", icon: Monitor, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  { label: "Open Incidents", value: "2", delta: "P1 · P3", icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  { label: "Uptime (30d)", value: "99.97%", delta: "SLA Met", icon: Activity, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
];

const endpointStatus = [
  { name: "GCP-PROD-01", status: "clean", ip: "10.0.1.4", os: "Ubuntu 24.04 LTS" },
  { name: "GCP-DB-PRIMARY", status: "clean", ip: "10.0.1.9", os: "Debian 12" },
  { name: "GCP-APP-SERVER", status: "warning", ip: "10.0.1.1", os: "Ubuntu 22.04 LTS" },
  { name: "GCP-BASTION", status: "clean", ip: "10.0.1.15", os: "Rocky Linux 9" },
  { name: "GCP-WORKER-01", status: "isolated", ip: "10.0.1.22", os: "Ubuntu 22.04 LTS" },
  { name: "GCP-LOGGING-SVC", status: "clean", ip: "10.0.1.31", os: "Debian 12" },
];

export default function SOCaaS() {
  const [escalating, setEscalating] = useState(false);

  const handleEscalate = () => {
    setEscalating(true);
    toast.success("🚨 EDS Incident Response Team notified. ETA: < 4 minutes.", { duration: 5000 });
    setTimeout(() => setEscalating(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Live Monitoring Active</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">SOCaaS / MSSP Monitoring</h1>
          <p className="text-sm text-muted-foreground mt-0.5">24/7 managed security operations — EDS Sentrix ASM threat intelligence layer</p>
        </div>
        <Button
          onClick={handleEscalate}
          disabled={escalating}
          className="bg-tactical-red hover:bg-red-700 text-white font-bold px-5 py-2.5 h-auto text-sm shadow-lg shadow-red-900/30 transition-all"
        >
          <ShieldAlert className="w-4 h-4 mr-2" />
          {escalating ? "Escalating…" : "Escalate to EDS Incident Response Team"}
        </Button>
      </div>

      {/* Thyreos C2 Integration Panel */}
      <ThyreosPanel />

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Card key={i} className={`border ${s.bg} shadow-sm`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <s.icon className={`w-5 h-5 ${s.color}`} />
                <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{s.delta}</span>
              </div>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Threat Map + Alerts Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <ThreatMap />
        </div>
        <div className="lg:col-span-2">
          <LiveAlertsFeed />
        </div>
      </div>

      {/* Endpoint Status */}
      <Card className="shadow-sm border-border/60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Monitor className="w-4 h-4 text-blue-400" />
              Managed Endpoint Status
            </CardTitle>
            <span className="text-xs text-muted-foreground">{endpointStatus.filter(e => e.status === "clean").length}/{endpointStatus.length} Clean</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {endpointStatus.map((ep, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer
                ${ep.status === "clean" ? "bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10" :
                  ep.status === "warning" ? "bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10" :
                  "bg-red-500/5 border-red-500/20 hover:bg-red-500/10"}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                  ${ep.status === "clean" ? "bg-emerald-500/10" : ep.status === "warning" ? "bg-amber-500/10" : "bg-red-500/10"}`}>
                  {ep.status === "clean" ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> :
                   ep.status === "warning" ? <AlertTriangle className="w-4 h-4 text-amber-400" /> :
                   <ZapOff className="w-4 h-4 text-red-400" />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{ep.name}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{ep.ip} · {ep.os}</p>
                </div>
                <span className={`ml-auto text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0
                  ${ep.status === "clean" ? "bg-emerald-500/20 text-emerald-400" :
                    ep.status === "warning" ? "bg-amber-500/20 text-amber-400" :
                    "bg-red-500/20 text-red-400"}`}>
                  {ep.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* MSSP / SIEM Solutions Section */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-violet-500/10 border border-violet-500/20 rounded-lg flex items-center justify-center">
            <Database className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">MSSP / SIEM Solutions</h2>
            <p className="text-xs text-muted-foreground">Managed security services & security information event management stack</p>
          </div>
          <span className="ml-auto text-[10px] font-bold tracking-widest text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-1 rounded-full">FULLY MANAGED</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: Database,
              color: "text-violet-400",
              bg: "bg-violet-500/10 border-violet-500/20",
              title: "SIEM Log Aggregation",
              status: "14,200 events/min",
              statusColor: "text-violet-400",
              desc: "Centralized ingestion of logs from GCP, AWS, Cloudflare, and on-prem Linux hosts. Normalized into a unified event schema for cross-cloud correlation and analysis.",
              tags: ["GCP Logging", "CEF/Syslog", "Multi-Cloud"],
            },
            {
              icon: Search,
              color: "text-blue-400",
              bg: "bg-blue-500/10 border-blue-500/20",
              title: "Threat Hunting",
              status: "Active",
              statusColor: "text-blue-400",
              desc: "Proactive analyst-led hunts for TTPs mapped to MITRE ATT&CK. Identifies dormant adversaries and lateral movement before alerts fire.",
              tags: ["MITRE ATT&CK", "IOC Sweep", "Behavioral"],
            },
            {
              icon: Bell,
              color: "text-amber-400",
              bg: "bg-amber-500/10 border-amber-500/20",
              title: "Alert Triage & Response",
              status: "< 4 min MTTR",
              statusColor: "text-amber-400",
              desc: "Tier 1/2/3 SOC analysts triage all alerts 24/7. False positives are suppressed. Confirmed incidents trigger automated playbooks and human escalation.",
              tags: ["24/7 Analyst", "Playbooks", "Auto-remediate"],
            },
            {
              icon: Network,
              color: "text-emerald-400",
              bg: "bg-emerald-500/10 border-emerald-500/20",
              title: "NDR — Network Detection",
              status: "Live",
              statusColor: "text-emerald-400",
              desc: "Deep packet inspection and east-west traffic analysis to detect C2 communication, data exfiltration, and lateral movement across your network segments.",
              tags: ["East-West", "DPI", "C2 Detection"],
            },
            {
              icon: Cpu,
              color: "text-cyan-400",
              bg: "bg-cyan-500/10 border-cyan-500/20",
              title: "EDR — Endpoint Detection",
              status: `${endpointStatus.length} Endpoints`,
              statusColor: "text-cyan-400",
              desc: "Lightweight agent-based telemetry on all managed Linux hosts and GCP compute instances. Real-time process monitoring, memory injection detection, and automated isolation of compromised hosts.",
              tags: ["Linux / GCP", "Memory analysis", "Auto-isolate"],
            },
            {
              icon: FileSearch,
              color: "text-rose-400",
              bg: "bg-rose-500/10 border-rose-500/20",
              title: "Vulnerability Management",
              status: "Continuous",
              statusColor: "text-rose-400",
              desc: "Integrated with Aikido Security for continuous CVE scanning of code, containers, and infrastructure. Risk-prioritized patch recommendations with SLA tracking.",
              tags: ["Aikido", "CVE / CVSS", "Patch SLA"],
            },
            {
              icon: Lock,
              color: "text-orange-400",
              bg: "bg-orange-500/10 border-orange-500/20",
              title: "Identity & Access Analytics",
              status: "UEBA Active",
              statusColor: "text-orange-400",
              desc: "User and Entity Behavior Analytics (UEBA) baseline normal login patterns and flag anomalous access — impossible travel, privilege escalation, off-hours activity.",
              tags: ["UEBA", "MFA Enforcement", "SSO"],
            },
            {
              icon: Eye,
              color: "text-indigo-400",
              bg: "bg-indigo-500/10 border-indigo-500/20",
              title: "Dark Web & Threat Intel",
              status: "Monitoring",
              statusColor: "text-indigo-400",
              desc: "Continuous dark web surveillance for leaked credentials, brand impersonation, and data dumps tied to your organization. Intelligence feeds enrich SIEM correlation rules.",
              tags: ["Credential Leaks", "Brand Intel", "OSINT"],
            },
            {
              icon: BarChart2,
              color: "text-teal-400",
              bg: "bg-teal-500/10 border-teal-500/20",
              title: "Compliance Reporting",
              status: "Auto-generated",
              statusColor: "text-teal-400",
              desc: "Automated report generation for NIST CSF, SOC 2, HIPAA, and CMMC audits. Executive-ready dashboards and evidence packages for insurance carriers.",
              tags: ["NIST", "SOC 2", "CMMC / HIPAA"],
            },
          ].map((item, i) => (
            <div key={i} className={`p-4 rounded-xl border ${item.bg} bg-card shadow-sm hover:shadow-md transition-shadow`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg border ${item.bg} flex items-center justify-center shrink-0`}>
                  <item.icon className={`w-4.5 h-4.5 ${item.color}`} />
                </div>
                <span className={`text-[9px] font-black tracking-widest px-2 py-1 rounded-full border ${item.bg} ${item.statusColor}`}>
                  {item.status}
                </span>
              </div>
              <p className="text-sm font-bold text-foreground mb-1.5">{item.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{item.desc}</p>
              <div className="flex flex-wrap gap-1">
                {item.tags.map((tag, t) => (
                  <span key={t} className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/60">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cloudflare / WAF Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Cloudflare WAF", status: "ACTIVE", icon: Globe, color: "text-emerald-400", sub: "2,841 requests filtered today" },
          { label: "GCP Cloud Armor", status: "ACTIVE", icon: Shield, color: "text-blue-400", sub: "Google Cloud · us-east4 region" },
          { label: "SIEM Ingestion", status: "LIVE", icon: Server, color: "text-violet-400", sub: "14,200 events/min · GCP Logging" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-card shadow-sm">
            <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center shrink-0">
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-foreground">{item.label}</p>
                <span className={`text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded ${item.color} bg-current/10`} style={{ background: "transparent", border: "1px solid currentColor", opacity: 1 }}>
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}