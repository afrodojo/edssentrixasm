import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield, AlertTriangle, CheckCircle2, XCircle, Wifi,
  Monitor, Globe, Zap, Activity, RefreshCw, PhoneCall,
  Lock, Eye, Server, Radio
} from "lucide-react";
import { toast } from "sonner";

const INITIAL_ALERTS = [
  { id: 1, time: "11:02 AM", level: "critical", msg: "Brute-force SSH attempt blocked — src: 185.220.101.47 (RU)", dot: "bg-red-500", icon: XCircle },
  { id: 2, time: "10:58 AM", level: "warn", msg: "Cloudflare WAF triggered — SQLi probe on /api/auth endpoint", dot: "bg-orange-400", icon: AlertTriangle },
  { id: 3, time: "10:51 AM", level: "info", msg: "Endpoint malware blocked — Device: Reception-PC-04 (Defender ATP)", dot: "bg-amber-400", icon: Shield },
  { id: 4, time: "10:44 AM", level: "ok", msg: "Aikido SAST Scan passed — 0 critical CVEs detected in build #118", dot: "bg-emerald-400", icon: CheckCircle2 },
  { id: 5, time: "10:39 AM", level: "warn", msg: "Anomalous outbound traffic — Device: CORP-LAPTOP-07 → 203.0.113.55", dot: "bg-orange-400", icon: AlertTriangle },
  { id: 6, time: "10:31 AM", level: "info", msg: "Unauthorized login blocked — user: admin@corp.local via OWA", dot: "bg-blue-400", icon: Lock },
  { id: 7, time: "10:22 AM", level: "ok", msg: "MFA enforcement verified for 14 active sessions", dot: "bg-emerald-400", icon: CheckCircle2 },
  { id: 8, time: "10:14 AM", level: "critical", msg: "Port scan detected — 1,024 ports probed from 45.33.91.2 (US/VPN)", dot: "bg-red-500", icon: XCircle },
  { id: 9, time: "09:58 AM", level: "ok", msg: "TLS 1.3 handshake verified — Cloudflare edge node updated", dot: "bg-emerald-400", icon: CheckCircle2 },
  { id: 10, time: "09:44 AM", level: "warn", msg: "Geo-block triggered — access attempt from OFAC-sanctioned region", dot: "bg-orange-400", icon: Globe },
];

const ENDPOINTS = [
  { name: "Reception-PC-04", status: "alert", os: "Win 11", ip: "10.0.1.24" },
  { name: "CORP-LAPTOP-07", status: "warn", os: "Win 11", ip: "10.0.1.31" },
  { name: "FileServer-01", status: "ok", os: "Ubuntu 22", ip: "10.0.1.5" },
  { name: "WebApp-PROD", status: "ok", os: "Docker/K8s", ip: "CF Edge" },
  { name: "MGMT-PC-01", status: "ok", os: "macOS 14", ip: "10.0.1.12" },
  { name: "VPN-GW-01", status: "ok", os: "pfSense", ip: "10.0.0.1" },
];

const THREAT_NODES = [
  { id: 1, x: 15, y: 25, label: "RU", level: "critical", country: "Russia" },
  { id: 2, x: 72, y: 18, label: "CN", level: "warn", country: "China" },
  { id: 3, x: 35, y: 60, label: "BR", level: "warn", country: "Brazil" },
  { id: 4, x: 82, y: 55, label: "KP", level: "critical", country: "N. Korea" },
  { id: 5, x: 50, y: 35, label: "US/VPN", level: "info", country: "US (Masked)" },
  { id: 6, x: 60, y: 70, label: "NG", level: "info", country: "Nigeria" },
];

const levelColor = {
  critical: "text-red-400 bg-red-500/10 border-red-500/30",
  warn: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  info: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  ok: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
};

const endpointColor = {
  alert: "bg-red-500",
  warn: "bg-amber-400",
  ok: "bg-emerald-400",
};

export default function SOCaaS() {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [escalating, setEscalating] = useState(false);
  const [liveCount, setLiveCount] = useState(0);

  // Simulate live event ticking in
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(c => c + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (liveCount === 0) return;
    const newEvent = {
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      level: ["ok", "warn", "info"][liveCount % 3],
      msg: [
        "Cloudflare rate-limit triggered — 412 req/s from single IP blocked",
        "Zero-day threat signature updated — Defender ATP synced",
        "DNS query to known C2 domain blocked — Device: CORP-LAPTOP-07",
      ][liveCount % 3],
      dot: ["bg-emerald-400", "bg-orange-400", "bg-blue-400"][liveCount % 3],
      icon: [CheckCircle2, AlertTriangle, Shield][liveCount % 3],
    };
    setAlerts(prev => [newEvent, ...prev.slice(0, 11)]);
  }, [liveCount]);

  const handleEscalate = () => {
    setEscalating(true);
    setTimeout(() => {
      setEscalating(false);
      toast.success("🚨 EDS Incident Response Team alerted. Response SLA: < 15 min.");
    }, 1800);
  };

  const criticalCount = alerts.filter(a => a.level === "critical").length;
  const warnCount = alerts.filter(a => a.level === "warn").length;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
            SOCaaS / MSSP Active Monitoring
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Real-time threat intelligence · Zero Trust enforcement · 24/7 managed detection & response</p>
        </div>
        <Button
          onClick={handleEscalate}
          disabled={escalating}
          className="bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-900/30 border border-red-500/50 gap-2"
        >
          {escalating ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <PhoneCall className="w-4 h-4" />
          )}
          {escalating ? "Escalating..." : "Escalate to EDS Incident Response"}
        </Button>
      </div>

      {/* Stat chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Critical Threats", val: criticalCount, color: "bg-red-500/10 border-red-500/25 text-red-400", icon: XCircle },
          { label: "Warnings", val: warnCount, color: "bg-amber-500/10 border-amber-500/25 text-amber-400", icon: AlertTriangle },
          { label: "Endpoints Online", val: "6/6", color: "bg-emerald-500/10 border-emerald-500/25 text-emerald-400", icon: Monitor },
          { label: "Threats Blocked (24h)", val: "1,294", color: "bg-blue-500/10 border-blue-500/25 text-blue-400", icon: Shield },
        ].map((s, i) => (
          <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${s.color}`}>
            <s.icon className="w-5 h-5 shrink-0" />
            <div>
              <p className="text-xl font-black">{s.val}</p>
              <p className="text-[10px] opacity-70 font-medium">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Threat Map + Endpoints */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Threat Map */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                Real-Time Global Threat Map
                <span className="ml-auto flex items-center gap-1.5 text-xs font-normal text-emerald-400">
                  <Wifi className="w-3 h-3 animate-pulse" />
                  LIVE
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full bg-navy-950 rounded-xl overflow-hidden border border-navy-700/50" style={{ height: 260 }}>
                {/* Grid lines */}
                {[...Array(8)].map((_, i) => (
                  <div key={`h${i}`} className="absolute border-t border-navy-700/30 w-full" style={{ top: `${(i + 1) * 12.5}%` }} />
                ))}
                {[...Array(12)].map((_, i) => (
                  <div key={`v${i}`} className="absolute border-l border-navy-700/30 h-full" style={{ left: `${(i + 1) * 8.33}%` }} />
                ))}

                {/* Continents placeholder shapes */}
                <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid meet">
                  {/* North America */}
                  <ellipse cx="175" cy="110" rx="90" ry="65" fill="#64748b" />
                  {/* South America */}
                  <ellipse cx="225" cy="210" rx="50" ry="60" fill="#64748b" />
                  {/* Europe */}
                  <ellipse cx="410" cy="90" rx="55" ry="50" fill="#64748b" />
                  {/* Africa */}
                  <ellipse cx="420" cy="195" rx="55" ry="65" fill="#64748b" />
                  {/* Asia */}
                  <ellipse cx="600" cy="110" rx="110" ry="65" fill="#64748b" />
                  {/* Australia */}
                  <ellipse cx="660" cy="215" rx="50" ry="35" fill="#64748b" />
                </svg>

                {/* Target — DMV HQ */}
                <div className="absolute" style={{ left: "22%", top: "40%" }}>
                  <div className="relative">
                    <div className="w-4 h-4 bg-emerald-400 rounded-full border-2 border-emerald-300 shadow-lg shadow-emerald-400/40 z-10 relative" />
                    <div className="absolute inset-0 w-4 h-4 bg-emerald-400 rounded-full animate-ping opacity-40" />
                  </div>
                  <span className="text-[9px] text-emerald-300 font-bold mt-1 block whitespace-nowrap">HQ · DMV</span>
                </div>

                {/* Threat nodes */}
                {THREAT_NODES.map(node => (
                  <div
                    key={node.id}
                    className="absolute"
                    style={{ left: `${node.x}%`, top: `${node.y}%`, transform: "translate(-50%, -50%)" }}
                  >
                    <div className={`relative w-3 h-3 rounded-full ${node.level === "critical" ? "bg-red-500" : node.level === "warn" ? "bg-orange-400" : "bg-blue-400"}`}>
                      <div className={`absolute inset-0 w-3 h-3 rounded-full animate-ping opacity-50 ${node.level === "critical" ? "bg-red-500" : node.level === "warn" ? "bg-orange-400" : "bg-blue-400"}`} />
                    </div>
                    <span className="text-[8px] text-slate-400 font-mono mt-0.5 block text-center">{node.label}</span>
                  </div>
                ))}

                {/* Legend */}
                <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 bg-navy-900/90 rounded-lg px-3 py-2 border border-navy-700/50">
                  {[
                    { dot: "bg-red-500", label: "Critical" },
                    { dot: "bg-orange-400", label: "Warning" },
                    { dot: "bg-blue-400", label: "Info" },
                    { dot: "bg-emerald-400", label: "HQ Online" },
                  ].map((l, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${l.dot}`} />
                      <span className="text-[9px] text-slate-400 font-mono">{l.label}</span>
                    </div>
                  ))}
                </div>

                <div className="absolute top-3 left-3 text-[9px] font-mono text-slate-500">
                  CLOUDFLARE WAF · ZERO TRUST · AIKIDO SAST
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Endpoint Status */}
        <div>
          <Card className="shadow-sm border-border/60 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Monitor className="w-4 h-4 text-violet-400" />
                Endpoint Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {ENDPOINTS.map((ep, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${endpointColor[ep.status]} ${ep.status !== "ok" ? "animate-pulse" : ""}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">{ep.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{ep.os} · {ep.ip}</p>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${ep.status === "ok" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : ep.status === "warn" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
                    {ep.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Live Alerts Feed */}
      <Card className="shadow-sm border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Activity className="w-4 h-4 text-red-400" />
            Live Security Alerts Feed
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse ml-1" />
            <span className="ml-auto text-xs font-normal text-muted-foreground font-mono">
              Auto-refreshing · Cloudflare + Defender ATP
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
            {alerts.map((alert, i) => {
              const Icon = alert.icon;
              return (
                <div key={alert.id} className={`flex items-start gap-3 px-3 py-2.5 rounded-lg transition-all border ${i === 0 && liveCount > 0 ? "border-amber-500/30 bg-amber-500/5" : "border-transparent hover:bg-muted/30"}`}>
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${alert.dot}`} />
                  <span className="text-[11px] font-mono text-muted-foreground shrink-0 w-16">{alert.time}</span>
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border shrink-0 ${levelColor[alert.level]}`}>
                    {alert.level}
                  </span>
                  <span className="text-xs text-foreground">{alert.msg}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Action Center */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: Server,
            title: "SIEM Integration",
            desc: "All events forwarded to Splunk / Elastic SIEM in real-time",
            color: "border-blue-500/20 bg-blue-500/5",
            badge: "ACTIVE",
            badgeColor: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          },
          {
            icon: Eye,
            title: "SOC Analyst On-Call",
            desc: "Tier-2 analyst monitoring dashboard · Next shift: 8 PM EST",
            color: "border-violet-500/20 bg-violet-500/5",
            badge: "ON-CALL",
            badgeColor: "bg-violet-500/10 border-violet-500/20 text-violet-400"
          },
          {
            icon: Zap,
            title: "Auto-Remediation",
            desc: "Playbook engine blocked 14 threats autonomously today",
            color: "border-amber-500/20 bg-amber-500/5",
            badge: "AUTO",
            badgeColor: "bg-amber-500/10 border-amber-500/20 text-amber-400"
          },
        ].map((item, i) => (
          <div key={i} className={`rounded-xl border p-4 ${item.color}`}>
            <div className="flex items-start justify-between mb-2">
              <item.icon className="w-5 h-5 text-muted-foreground" />
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>{item.badge}</span>
            </div>
            <p className="text-sm font-bold text-foreground">{item.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}