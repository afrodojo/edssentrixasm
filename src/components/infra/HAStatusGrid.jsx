import React from "react";
import { Activity, Server, Cloud, Wifi, Shield, Database, Zap, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const metrics = [
  { icon: Activity, label: "Overall Uptime (30d)", value: "99.97%", sub: "SLA Met", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  { icon: Server, label: "Primary Hub (Site 1)", value: "LIVE", sub: "BIZON B200 — Healthy", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  { icon: Shield, label: "Warm DR (Site 2)", value: "SYNC", sub: "Heartbeat OK · < 2s lag", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  { icon: Cloud, label: "GCP Multi-Region", value: "READY", sub: "Failover standby · us-east4", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  { icon: Wifi, label: "SD-WAN Fabric", value: "AES-256", sub: "3 Tunnels Active", color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
  { icon: Zap, label: "Thyreos C2", value: "ACTIVE", sub: "SOAR · Auto-response ON", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
  { icon: Database, label: "BCR — Data Replication", value: "LIVE", sub: "Multi-region sync · NVMe", color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
  { icon: CheckCircle2, label: "Zero-Trust IAP", value: "ON", sub: "MFA enforced all enclaves", color: "text-teal-400", bg: "bg-teal-500/10 border-teal-500/20" },
];

export default function HAStatusGrid({ tick }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {metrics.map((m, i) => (
        <Card key={i} className={`border ${m.bg} shadow-sm`}>
          <CardContent className="p-3 text-center">
            <m.icon className={`w-4 h-4 ${m.color} mx-auto mb-1.5`} />
            <p className={`text-sm font-black ${m.color}`}>{m.value}</p>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide mt-0.5 leading-tight">{m.label}</p>
            <p className="text-[9px] text-muted-foreground/60 mt-0.5 leading-tight">{m.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}