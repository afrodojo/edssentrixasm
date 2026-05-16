import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, ExternalLink } from "lucide-react";

const THYREOS_URL = "https://thyreos.eds-360.com";

const sites = [
  {
    id: "site1",
    label: "SITE 1 — PRIMARY HUB",
    sub: "1Gbps Dedicated Fiber (Nitel)",
    color: "border-blue-500/40 bg-blue-500/5",
    dotColor: "bg-blue-400",
    titleColor: "text-blue-400",
    items: ["Meraki MX105 (Hub)", "MS130-48 Switch", "BIZON B200 (PROD)", "4x DGX Spark (DEV)", "NVMe SAN Storage", "4x Mac Studio Hub"],
  },
  {
    id: "site2",
    label: "SITE 2 — WARM DR",
    sub: "300Mbps Broadband",
    color: "border-amber-500/40 bg-amber-500/5",
    dotColor: "bg-amber-400",
    titleColor: "text-amber-400",
    items: ["Meraki MX68 (Spoke)", "MS130-8 Switch", "Warm Meta-Sync", "Critical Heartbeat", "24U Vented Cabinet"],
  },
  {
    id: "site3",
    label: "SITE 3 — GCP CLOUD",
    sub: "Multi-Region HA",
    color: "border-emerald-500/40 bg-emerald-500/5",
    dotColor: "bg-emerald-400",
    titleColor: "text-emerald-400",
    items: ["Meraki vMX (Virtual)", "Global Load Balancer", "Container Failover", "Multi-Region Storage", "GCP us-east4 / us-central1"],
  },
];

export default function TopologyDiagram() {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setPulse(n => (n + 1) % 3), 1200);
    return () => clearInterval(t);
  }, []);

  return (
    <Card className="shadow-sm border-border/60">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Network className="w-4 h-4 text-cyan-400" />
            Triple-Enclave Active Topology
          </CardTitle>
          <a
            href={THYREOS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
          >
            Thyreos C2 Live <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Internet → Cloudflare → IAP */}
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="px-4 py-2 rounded-lg bg-slate-800/60 border border-slate-600/40 text-xs font-mono text-slate-300 font-bold">
            🌐 GLOBAL PUBLIC INTERNET
          </div>
          <div className="w-px h-4 bg-slate-600" />
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/30 text-xs font-bold text-orange-300">
            ☁️ CLOUDFLARE SECURE GATEWAY &nbsp;<span className="text-orange-500/60 font-normal">SOC 2 Type 2 / 99.9% Uptime</span>
          </div>
          <div className="w-px h-4 bg-slate-600" />
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/30 text-xs font-bold text-violet-300">
              🔐 IAP + Zero-Trust Policy
            </div>
            <div className="text-slate-500 text-xs">→</div>
            <div className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-xs font-bold text-cyan-300">
              🤖 Thyreos C2 SOAR
            </div>
          </div>
          <div className="w-px h-4 bg-slate-600" />
          {/* SD-WAN Fabric label */}
          <div className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-emerald-500/10 border border-cyan-500/20 text-xs font-black text-cyan-400 tracking-widest uppercase text-center">
            ══ SECURE ENCRYPTED SD-WAN FABRIC (AES-256 AUTO-VPN) ══
          </div>
        </div>

        {/* Three Sites */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sites.map((site, i) => (
            <div key={site.id} className={`relative rounded-xl border p-4 ${site.color}`}>
              {/* Animated sync dot */}
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2 h-2 rounded-full ${site.dotColor} ${pulse === i ? "animate-ping" : "opacity-60"}`} />
                <div>
                  <p className={`text-xs font-black tracking-wide ${site.titleColor}`}>{site.label}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{site.sub}</p>
                </div>
              </div>
              <ul className="space-y-1">
                {site.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className={`w-1 h-1 rounded-full shrink-0 ${site.dotColor}`} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-muted-foreground text-center italic border-t border-border/40 pt-3">
          Active Status: Real-time synchronization between all three enclaves ensures zero-interruption for Thyreos and Sentrix ASM.
        </p>
      </CardContent>
    </Card>
  );
}