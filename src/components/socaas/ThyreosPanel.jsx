import React, { useState, useEffect } from "react";
import { ExternalLink, Zap, ShieldCheck, Activity, Users, Scale, Shield, Building2, ChevronRight, Radio, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const THYREOS_URL = "https://thyreos.eds-360.com";

const thyreosStats = [
  { label: "Threats Blocked", value: "14.2K", sub: "Daily / per tenant", color: "text-emerald-400" },
  { label: "Assets Monitored", value: "3,891", sub: "Across all domains", color: "text-blue-400" },
  { label: "Mean Time to Detect", value: "< 90s", sub: "AI-powered correlation", color: "text-amber-400" },
  { label: "Compliance Score", value: "98.4%", sub: "NIST / SOC2 / CMMC", color: "text-violet-400" },
];

const divisions = [
  { label: "Cyber Division", tag: "MDR / XDR", desc: "24/7 SOCaaS · XDR · SIEM · SOAR", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", icon: Shield, href: "https://cyber.eds-360.com/" },
  { label: "Defense Division", tag: "Threat Intel", desc: "OSINT · CVE Mgmt · Red Team", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20", icon: Activity, href: "https://defense.eds-360.com/" },
  { label: "Mowdojo", tag: "Physical Sec", desc: "CPTED · SOAR Integration · AI Video", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", icon: Building2, href: "https://mowdojo.eds-360.com/" },
  { label: "NPS Legal", tag: "Compliance", desc: "CMMC · FedRAMP · HIPAA Roadmaps", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", icon: Scale, href: "https://nps.eds-360.com/" },
];

const certs = ["SOC 2 Type II", "ISO 27001", "NIST CSF", "CMMC Ready", "FedRAMP Auth"];

const eventStream = [
  { age: "00:29s", msg: "Threat hunt sweep complete — 0 indicators", color: "text-emerald-400" },
  { age: "00:34s", msg: "HITL approval required — Firewall rule change", color: "text-amber-400" },
  { age: "00:02s", msg: "Cloudflare WAF blocked SQLi — 203.0.113.45", color: "text-red-400" },
];

export default function ThyreosPanel() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 3500);
    return () => clearInterval(t);
  }, []);

  // Cycle the highlighted event
  const activeEvent = tick % eventStream.length;

  return (
    <Card className="border-cyan-500/30 bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <CardHeader className="pb-3 bg-gradient-to-r from-cyan-500/5 to-transparent border-b border-cyan-500/20">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/25 rounded-xl flex items-center justify-center">
              <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-black tracking-tight">THYREOS C2</CardTitle>
                <span className="text-[9px] font-black tracking-widest px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-full">ACTIVE</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Agentic C2 · MDR · XDR · SOAR — by EDS 360</p>
            </div>
          </div>
          <a
            href={THYREOS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black rounded-lg transition-all active:scale-95 shrink-0"
          >
            Launch Thyreos C2 <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </CardHeader>

      <CardContent className="pt-5 space-y-5">
        {/* Live stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {thyreosStats.map((s, i) => (
            <div key={i} className="bg-muted/40 border border-border/60 rounded-xl p-3 text-center">
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mt-0.5">{s.label}</p>
              <p className="text-[9px] text-muted-foreground/60 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* ASHE AI Agentic Event Stream */}
        <div className="bg-slate-950/60 border border-slate-700/40 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">ASHE AI · Agentic Event Stream</span>
            <span className="ml-auto text-[9px] font-mono text-slate-600">LIVE</span>
          </div>
          <div className="space-y-1.5">
            {eventStream.map((e, i) => (
              <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-500 ${i === activeEvent ? "bg-slate-800/80" : "opacity-50"}`}>
                <span className="text-[9px] font-mono text-slate-600 w-12 shrink-0">{e.age}</span>
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${i === activeEvent ? "bg-cyan-400" : "bg-slate-600"}`} />
                <span className={`text-xs font-medium ${i === activeEvent ? e.color : "text-slate-500"}`}>{e.msg}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Four Divisions */}
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">360° Platform Divisions</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {divisions.map((d, i) => (
              <a
                key={i}
                href={d.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex flex-col gap-2 p-3.5 rounded-xl border ${d.bg} hover:opacity-90 transition-all`}
              >
                <div className="flex items-center justify-between">
                  <d.icon className={`w-4 h-4 ${d.color}`} />
                  <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${d.bg} ${d.color}`}>{d.tag}</span>
                </div>
                <p className={`text-sm font-bold ${d.color}`}>{d.label}</p>
                <p className="text-[10px] text-muted-foreground leading-snug">{d.desc}</p>
                <div className="flex items-center gap-1 mt-auto">
                  <span className={`text-[9px] font-bold ${d.color}`}>Visit</span>
                  <ChevronRight className={`w-3 h-3 ${d.color} group-hover:translate-x-0.5 transition-transform`} />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Cert badges + CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-border/40">
          <div className="flex flex-wrap gap-1.5">
            {certs.map(c => (
              <span key={c} className="text-[9px] font-bold px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-2.5 h-2.5" />{c}
              </span>
            ))}
          </div>
          <a
            href={`${THYREOS_URL}/#contact`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-bold transition-colors whitespace-nowrap"
          >
            Request Free Threat Assessment <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}