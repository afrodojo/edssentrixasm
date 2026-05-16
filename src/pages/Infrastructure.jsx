import React, { useState, useEffect } from "react";
import { ExternalLink, CheckCircle2, AlertTriangle, RefreshCw, GitBranch, Shield, Server, Cloud, Wifi, Zap, Activity, Radio, Lock, ChevronRight, ArrowRight, Database, Cpu, Network } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TopologyDiagram from "../components/infra/TopologyDiagram";
import CICDPipeline from "../components/infra/CICDPipeline";
import FailoverStatus from "../components/infra/FailoverStatus";
import HAStatusGrid from "../components/infra/HAStatusGrid";

const THYREOS_URL = "https://thyreos.eds-360.com";

export default function Infrastructure() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">All Systems Operational</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Infrastructure & Operations</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Triple-Enclave HA/BCR · SD-WAN Failover · CI/CD Pipeline · Thyreos C2 Integration</p>
        </div>
        <a
          href={THYREOS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-black rounded-lg transition-all shrink-0"
        >
          <Radio className="w-4 h-4" /> Open Thyreos C2 <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* HA Status Grid */}
      <HAStatusGrid tick={tick} />

      {/* Topology Diagram */}
      <TopologyDiagram />

      {/* Failover + CI/CD side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FailoverStatus tick={tick} />
        <CICDPipeline tick={tick} />
      </div>

      {/* Zero-Trust + Compliance strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Lock, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20", title: "Zero-Trust IAP", body: "All traffic authenticated via Identity-Aware Proxy + MFA before reaching any enclave." },
          { icon: Shield, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", title: "CMMC 2.0 / SOC 2", body: "Evidence auto-gathered by Sentrix ASM. Micro-segmentation between Prod & Dev enclaves." },
          { icon: Activity, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20", title: "NBD Hardware SLA", body: "Next-Business-Day replacement via Meraki/Nitel agreement. No single point of failure." },
        ].map((item, i) => (
          <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border ${item.bg}`}>
            <div className={`w-9 h-9 rounded-lg border ${item.bg} flex items-center justify-center shrink-0 mt-0.5`}>
              <item.icon className={`w-4 h-4 ${item.color}`} />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{item.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}