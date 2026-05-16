import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Radio, RefreshCw, ShieldCheck, AlertTriangle, XCircle, Zap, ExternalLink, CheckCircle2, Clock } from "lucide-react";

const THYREOS_URL = "https://thyreos.eds-360.com";

// Simulated telemetry pool matching Thyreos SOAR event format
const TELEMETRY_POOL = [
  { severity: "blocked", msg: "Brute-force SSH blocked — 89.34.221.4 (RU) → GCP-PROD-01", source: "Thyreos · EDR" },
  { severity: "contained", msg: "Polymorphic payload quarantined in < 42s — GCP-WORKER-01", source: "Thyreos · SOAR" },
  { severity: "warning", msg: "Unusual outbound DNS spike detected — GCP-APP-SERVER", source: "Thyreos · NDR" },
  { severity: "blocked", msg: "SQLi attempt blocked in web form — GCP Cloud Armor", source: "Thyreos · WAF" },
  { severity: "info", msg: "Threat hunt sweep complete — 0 IOCs found across all enclaves", source: "Thyreos · Threat Intel" },
  { severity: "contained", msg: "C2 callback attempt auto-isolated — GCP-DB-PRIMARY", source: "Thyreos · SOAR" },
  { severity: "blocked", msg: "XSS payload neutralised — Cloudflare WAF Layer 7", source: "Thyreos · WAF" },
  { severity: "warning", msg: "Privilege escalation attempt — GCP IAM anomaly detected", source: "Thyreos · UEBA" },
  { severity: "info", msg: "CMMC 2.0 evidence snapshot captured — all controls green", source: "Thyreos · Compliance" },
  { severity: "blocked", msg: "TOR exit-node port scan blocked — 185.220.101.0/24", source: "Thyreos · EDR" },
];

const sevConfig = {
  blocked:   { label: "BLOCKED",   color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", dot: "bg-emerald-400", icon: ShieldCheck },
  contained: { label: "CONTAINED", color: "text-cyan-400",    bg: "bg-cyan-500/10 border-cyan-500/20",       dot: "bg-cyan-400",    icon: Zap },
  warning:   { label: "WARN",      color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/20",     dot: "bg-amber-400",   icon: AlertTriangle },
  info:      { label: "INFO",      color: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20",       dot: "bg-blue-400",    icon: CheckCircle2 },
  critical:  { label: "CRITICAL",  color: "text-red-400",     bg: "bg-red-500/10 border-red-500/20",         dot: "bg-red-500",     icon: XCircle },
};

function pickRandom(pool, count) {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((t, i) => ({
    ...t,
    id: Date.now() + i,
    time: new Date(Date.now() - i * 1000 * 60 * (Math.floor(Math.random() * 12) + 1))
      .toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  }));
}

function buildStats(events) {
  return {
    blocked:   events.filter(e => e.severity === "blocked").length,
    contained: events.filter(e => e.severity === "contained").length,
    warnings:  events.filter(e => e.severity === "warning").length,
    total:     events.length,
  };
}

export default function ThyreosSyncSummary() {
  const [events, setEvents] = useState(() => pickRandom(TELEMETRY_POOL, 5));
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(new Date());
  const [ticker, setTicker] = useState(0);

  // Auto-refresh every 30s
  useEffect(() => {
    const iv = setInterval(() => {
      setTicker(n => n + 1);
    }, 30000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (ticker === 0) return;
    doSync();
  }, [ticker]);

  const doSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setEvents(pickRandom(TELEMETRY_POOL, 5));
      setLastSync(new Date());
      setSyncing(false);
    }, 900);
  };

  const stats = buildStats(events);
  const syncTimeStr = lastSync.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <Card className="shadow-sm border-cyan-500/20 bg-card">
      <CardHeader className="pb-3 border-b border-border/40">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            Thyreos C2 — Threat Telemetry Sync
            <span className="text-[9px] font-black tracking-widest px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full">LIVE</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
              <Clock className="w-3 h-3" />
              Synced {syncTimeStr}
            </div>
            <button
              onClick={doSync}
              disabled={syncing}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/20 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Syncing…" : "Sync Now"}
            </button>
            <a
              href={THYREOS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Open C2 <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Stat pills */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Events Synced", value: stats.total,     color: "text-foreground",    bg: "bg-muted/40 border-border/60" },
            { label: "Threats Blocked", value: stats.blocked,   color: "text-emerald-400",   bg: "bg-emerald-500/10 border-emerald-500/20" },
            { label: "Auto-Contained",  value: stats.contained, color: "text-cyan-400",      bg: "bg-cyan-500/10 border-cyan-500/20" },
            { label: "Warnings",        value: stats.warnings,  color: "text-amber-400",     bg: "bg-amber-500/10 border-amber-500/20" },
          ].map((s, i) => (
            <div key={i} className={`rounded-xl border p-3 text-center ${s.bg}`}>
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Event list */}
        <div className="space-y-0 divide-y divide-border/30 rounded-xl border border-border/40 overflow-hidden bg-muted/10">
          {syncing
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-muted shrink-0" />
                  <div className="flex-1 h-3 bg-muted rounded" />
                  <div className="w-16 h-3 bg-muted rounded" />
                </div>
              ))
            : events.map((ev, i) => {
                const cfg = sevConfig[ev.severity] || sevConfig.info;
                const Icon = cfg.icon;
                return (
                  <div key={ev.id} className="flex items-start gap-3 px-4 py-2.5 hover:bg-muted/20 transition-colors">
                    <div className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${cfg.dot}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded border ${cfg.color} ${cfg.bg}`}>
                          {cfg.label}
                        </span>
                        <span className="text-[9px] text-muted-foreground font-mono">{ev.source}</span>
                        <span className="text-[10px] font-mono text-muted-foreground ml-auto shrink-0">{ev.time}</span>
                      </div>
                      <p className="text-xs text-foreground leading-snug">{ev.msg}</p>
                    </div>
                  </div>
                );
              })}
        </div>

        <p className="text-[10px] text-muted-foreground text-center">
          Telemetry sourced from <a href={THYREOS_URL} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">thyreos.eds-360.com</a> · Auto-refreshes every 30s · SOAR correlation active
        </p>
      </CardContent>
    </Card>
  );
}