import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw } from "lucide-react";

const tunnels = [
  { from: "Site 1 (Primary)", to: "Site 2 (Warm DR)", latency: "4ms", status: "active", type: "MX105 → MX68" },
  { from: "Site 1 (Primary)", to: "Site 3 (GCP)", latency: "18ms", status: "active", type: "MX105 → vMX" },
  { from: "Site 2 (Warm DR)", to: "Site 3 (GCP)", latency: "21ms", status: "active", type: "MX68 → vMX" },
];

const failoverSteps = [
  { step: "1", label: "Heartbeat Lost", desc: "Site 1 heartbeat timeout — MX105 unreachable", trigger: "< 500ms" },
  { step: "2", label: "SD-WAN Reroute", desc: "Traffic auto-rerouted via Meraki Auto-VPN to Site 2", trigger: "< 2s" },
  { step: "3", label: "GCP Failover Init", desc: "Container failover instances warm-start in us-east4", trigger: "< 30s" },
  { step: "4", label: "Thyreos Alert", desc: "SOAR fires automated incident + notifies EDS ops team", trigger: "< 42s" },
  { step: "5", label: "BCR Confirmed", desc: "Business continuity restored — full GCP + Site 2 operation", trigger: "< 90s" },
];

export default function FailoverStatus({ tick }) {
  const [simulating, setSimulating] = useState(false);
  const [simStep, setSimStep] = useState(-1);

  const runSim = () => {
    if (simulating) return;
    setSimulating(true);
    setSimStep(0);
    let s = 0;
    const iv = setInterval(() => {
      s++;
      setSimStep(s);
      if (s >= failoverSteps.length) {
        clearInterval(iv);
        setTimeout(() => { setSimulating(false); setSimStep(-1); }, 2000);
      }
    }, 800);
  };

  return (
    <Card className="shadow-sm border-border/60 h-full flex flex-col">
      <CardHeader className="pb-3 shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Wifi className="w-4 h-4 text-cyan-400" />
            SD-WAN Failover & BCR
          </CardTitle>
          <button
            onClick={runSim}
            disabled={simulating}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/20 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${simulating ? "animate-spin" : ""}`} />
            Simulate Failover
          </button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        {/* Active Tunnels */}
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Active SD-WAN Tunnels</p>
          <div className="space-y-2">
            {tunnels.map((t, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/40 border border-border/50">
                <div className={`w-2 h-2 rounded-full shrink-0 ${simulating && i === 0 ? "bg-red-400" : "bg-emerald-400"} animate-pulse`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{t.from} <ArrowRight className="inline w-3 h-3 mx-1 text-muted-foreground" /> {t.to}</p>
                  <p className="text-[10px] font-mono text-muted-foreground">{t.type} · {t.latency}</p>
                </div>
                <span className={`text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded border ${simulating && i === 0 ? "text-red-400 bg-red-500/10 border-red-500/20" : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"}`}>
                  {simulating && i === 0 ? "FAILOVER" : "ACTIVE"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Failover Sequence */}
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">BCR Failover Sequence</p>
          <div className="space-y-1.5">
            {failoverSteps.map((fs, i) => (
              <div key={i} className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all duration-300 ${
                simStep >= i + 1 ? "bg-emerald-500/10 border-emerald-500/20" :
                simStep === i ? "bg-amber-500/10 border-amber-500/20 animate-pulse" :
                "bg-muted/20 border-border/30 opacity-50"
              }`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-black border ${
                  simStep >= i + 1 ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" :
                  simStep === i ? "bg-amber-500/20 border-amber-500/30 text-amber-400" :
                  "bg-muted border-border text-muted-foreground"
                }`}>{fs.step}</div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-foreground">{fs.label} <span className="text-[9px] font-mono text-muted-foreground ml-1">{fs.trigger}</span></p>
                  <p className="text-[10px] text-muted-foreground">{fs.desc}</p>
                </div>
                {simStep >= i + 1 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}