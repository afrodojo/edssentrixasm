import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch, CheckCircle2, XCircle, Clock, Zap, Shield, Cloud, Package } from "lucide-react";

const stages = [
  {
    icon: GitBranch,
    label: "Code Push",
    desc: "Developer commits to main branch via GitHub",
    tool: "GitHub Actions",
    status: "pass",
    time: "0s",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: Shield,
    label: "SAST + Secrets Scan",
    desc: "Aikido Security static analysis & secret detection",
    tool: "Aikido Security",
    status: "pass",
    time: "~45s",
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    icon: Package,
    label: "Build & Test",
    desc: "Container image built, unit & integration tests run",
    tool: "Docker / pytest",
    status: "pass",
    time: "~2m",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    icon: Zap,
    label: "Thyreos Security Gate",
    desc: "SOAR validates build hash & approves deployment",
    tool: "Thyreos C2",
    status: "pass",
    time: "< 5s",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
  },
  {
    icon: Cloud,
    label: "Deploy to GCP",
    desc: "Containerized image deployed to GCP — Cloudflare cache purge",
    tool: "GCP Cloud Run",
    status: "pass",
    time: "~1m",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: CheckCircle2,
    label: "Sentrix ASM Verify",
    desc: "Sentrix ASM runs post-deploy surface scan & logs compliance event",
    tool: "Sentrix ASM",
    status: "pass",
    time: "~30s",
    color: "text-teal-400",
    bg: "bg-teal-500/10 border-teal-500/20",
  },
];

const recentRuns = [
  { id: "run-491", branch: "main", commit: "fix: patch CVE-2025-1192", status: "pass", ago: "12m ago", duration: "4m 22s" },
  { id: "run-490", branch: "feature/thyreos-v2", commit: "feat: SOAR agentic rules update", status: "pass", ago: "2h ago", duration: "4m 01s" },
  { id: "run-489", branch: "hotfix/siem-parser", commit: "fix: GCP logging parser null ref", status: "fail", ago: "5h ago", duration: "1m 12s" },
  { id: "run-488", branch: "main", commit: "chore: dependency upgrades", status: "pass", ago: "1d ago", duration: "4m 44s" },
];

export default function CICDPipeline({ tick }) {
  const [activeStage, setActiveStage] = useState(-1);
  const [running, setRunning] = useState(false);

  const runPipeline = () => {
    if (running) return;
    setRunning(true);
    setActiveStage(0);
    let s = 0;
    const iv = setInterval(() => {
      s++;
      setActiveStage(s);
      if (s >= stages.length) {
        clearInterval(iv);
        setTimeout(() => { setRunning(false); setActiveStage(-1); }, 1500);
      }
    }, 700);
  };

  return (
    <Card className="shadow-sm border-border/60 h-full flex flex-col">
      <CardHeader className="pb-3 shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-violet-400" />
            CI/CD Pipeline
          </CardTitle>
          <button
            onClick={runPipeline}
            disabled={running}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-lg hover:bg-violet-500/20 transition-all disabled:opacity-50"
          >
            <Zap className={`w-3 h-3 ${running ? "animate-pulse" : ""}`} />
            {running ? "Running…" : "Simulate Run"}
          </button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        {/* Pipeline stages */}
        <div className="space-y-1.5">
          {stages.map((s, i) => (
            <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all duration-300 ${
              activeStage > i ? "bg-emerald-500/10 border-emerald-500/20" :
              activeStage === i ? `${s.bg} animate-pulse` :
              "bg-muted/20 border-border/30 opacity-60"
            }`}>
              <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${
                activeStage > i ? "bg-emerald-500/20 border-emerald-500/30" :
                activeStage === i ? s.bg :
                "bg-muted border-border"
              }`}>
                {activeStage > i
                  ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  : <s.icon className={`w-3.5 h-3.5 ${activeStage === i ? s.color : "text-muted-foreground"}`} />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-xs font-bold ${activeStage === i ? s.color : "text-foreground"}`}>{s.label}</p>
                  <span className="text-[9px] font-mono text-muted-foreground">{s.time}</span>
                </div>
                <p className="text-[10px] text-muted-foreground truncate">{s.desc}</p>
              </div>
              <span className="text-[9px] font-bold text-muted-foreground shrink-0">{s.tool}</span>
            </div>
          ))}
        </div>

        {/* Recent runs */}
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Recent Runs</p>
          <div className="space-y-1.5">
            {recentRuns.map((r, i) => (
              <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-muted/30 border border-border/40">
                {r.status === "pass"
                  ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  : <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground font-medium truncate">{r.commit}</p>
                  <p className="text-[10px] font-mono text-muted-foreground">{r.branch} · {r.duration}</p>
                </div>
                <span className="text-[9px] text-muted-foreground shrink-0">{r.ago}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}