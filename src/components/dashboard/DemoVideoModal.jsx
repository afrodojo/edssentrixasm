import React, { useState } from "react";
import { X, Play, ChevronRight, ChevronLeft, Shield, KeyRound, Server, GitBranch, FileText, Zap, BarChart2, ShieldCheck, CheckCircle2, AlertTriangle, Clock, Building2 } from "lucide-react";

const slides = [
  {
    id: "welcome",
    tag: "Overview",
    title: "EDS Sentrix ASM",
    subtitle: "Attack Surface Management Platform",
    description: "A unified command center for security operations, compliance management, legal dispatch, and infrastructure monitoring — purpose-built for DMV-area law firms, property managers, and medical clinics.",
    visual: "hero",
    highlights: [
      { icon: Shield, text: "Zero Trust Architecture" },
      { icon: CheckCircle2, text: "NIST SP 800-53 Aligned" },
      { icon: FileText, text: "SOC-2 Type II Compliant" },
      { icon: BarChart2, text: "Insurance Premium Reduction Reports" },
    ],
  },
  {
    id: "dashboard",
    tag: "Command Center",
    title: "Operational Dashboard",
    subtitle: "Real-time security posture at a glance",
    description: "The Command Center aggregates live threat feeds, compliance status, and service dispatch into a single pane of glass. Admins see their Readiness Score, audit trail, and quick-dispatch shortcuts instantly.",
    visual: "dashboard",
    highlights: [
      { icon: Zap, text: "Live Audit Feed with timestamped events" },
      { icon: ShieldCheck, text: "Security Readiness Score (0–100)" },
      { icon: CheckCircle2, text: "Quick Dispatch — Notary, CPTED, Drone, EP" },
      { icon: AlertTriangle, text: "Threat alerts with IP blocking" },
    ],
  },
  {
    id: "licenses",
    tag: "License Management",
    title: "License & Subscription Control",
    subtitle: "Issue, renew, and monitor all product seats",
    description: "Administrators can issue licenses per organization, track seat utilization, set auto-renewal policies, and receive automated expiry alerts 30 days in advance — eliminating manual tracking.",
    visual: "licenses",
    highlights: [
      { icon: KeyRound, text: "Per-org product licensing (7 modules)" },
      { icon: Clock, text: "Auto-expiry alerts via email digest" },
      { icon: CheckCircle2, text: "One-click 1-year renewal" },
      { icon: BarChart2, text: "License MRR tracking" },
    ],
  },
  {
    id: "infra",
    tag: "Infrastructure",
    title: "Infrastructure Asset Tracker",
    subtitle: "Monitor every server, endpoint, and cert",
    description: "Track all cloud and on-premise assets across Azure, AWS, GCP, and Cloudflare. Filter by health status to immediately surface critical, warning, or offline assets needing attention.",
    visual: "infra",
    highlights: [
      { icon: Server, text: "Multi-cloud asset inventory" },
      { icon: AlertTriangle, text: "Flagged asset banner with one-click filter" },
      { icon: CheckCircle2, text: "Patch date tracking & expiry monitoring" },
      { icon: BarChart2, text: "Monthly infrastructure cost reporting" },
    ],
  },
  {
    id: "sdlc",
    tag: "DevSecOps",
    title: "SDLC Project Tracker",
    subtitle: "Secure software delivery lifecycle",
    description: "Manage development projects through all lifecycle phases — from planning to maintenance — with status indicators, completion tracking, and direct ClickUp integration for task management.",
    visual: "sdlc",
    highlights: [
      { icon: GitBranch, text: "7-phase SDLC pipeline (Planning → Maintenance)" },
      { icon: CheckCircle2, text: "On-track / At-risk / Blocked / Completed views" },
      { icon: Zap, text: "ClickUp task sync" },
      { icon: ShieldCheck, text: "Repo URL & tech stack logging" },
    ],
  },
  {
    id: "dispatch",
    tag: "Dispatch",
    title: "Legal & Field Dispatch",
    subtitle: "On-demand professional deployment",
    description: "Request mobile notaries, CPTED security audits, aerial drone deployments, and executive protection details — all tracked end-to-end with ClickUp workflows and real-time status updates.",
    visual: "dispatch",
    highlights: [
      { icon: FileText, text: "Mobile Notary booking with jurisdiction routing" },
      { icon: Shield, text: "CPTED audit scheduling" },
      { icon: Zap, text: "Drone & aerial ops deployment" },
      { icon: ShieldCheck, text: "Executive Protection request management" },
    ],
  },
  {
    id: "portal",
    tag: "Client Portal",
    title: "Self-Service Client Portal",
    subtitle: "Transparency for every client organization",
    description: "Clients log in to view their active licenses, monitor SDLC project phases, and generate on-demand monthly compliance reports — eliminating support tickets and increasing retention.",
    visual: "portal",
    highlights: [
      { icon: Building2, text: "Per-org license & seat visibility" },
      { icon: GitBranch, text: "Live SDLC project phase tracking" },
      { icon: FileText, text: "AI-generated monthly compliance reports" },
      { icon: CheckCircle2, text: "Secure, role-gated access" },
    ],
  },
];

const VisualHero = () => (
  <div className="relative h-full bg-gradient-to-br from-slate-900 via-navy-900 to-slate-950 flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(251,191,36,0.08),transparent)]" />
    <div className="text-center z-10 px-4">
      <div className="w-20 h-20 mx-auto mb-4 bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl flex items-center justify-center">
        <Shield className="w-10 h-10 text-amber-400" />
      </div>
      <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">EDS Sentrix ASM</p>
      <p className="text-white text-2xl font-black">Unified Security Platform</p>
      <p className="text-slate-400 text-sm mt-2">DMV · Law · Property · Medical · Corporate</p>
      <div className="flex justify-center gap-2 mt-5">
        {["NIST","SOC-2","ZERO TRUST","NIST 800-53"].map(b => (
          <span key={b} className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold rounded-full">{b}</span>
        ))}
      </div>
    </div>
  </div>
);

const VisualDashboard = () => (
  <div className="h-full bg-slate-900 p-4 overflow-hidden">
    <div className="grid grid-cols-4 gap-2 mb-3">
      {[{l:"Readiness",v:"92",c:"text-emerald-400"},{l:"Active Alerts",v:"3",c:"text-red-400"},{l:"Dispatches",v:"14",c:"text-blue-400"},{l:"Compliance",v:"98%",c:"text-amber-400"}].map(k=>(
        <div key={k.l} className="bg-slate-800 rounded-lg p-2.5 border border-slate-700/50">
          <p className="text-[9px] text-slate-500 uppercase">{k.l}</p>
          <p className={`text-xl font-black ${k.c}`}>{k.v}</p>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-3 gap-2 mb-3">
      {["Book Notary","CPTED Audit","Deploy Drone"].map(b=>(
        <div key={b} className="bg-slate-800 border border-slate-700/50 rounded-lg p-2 flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-[10px] text-slate-300 font-semibold">{b}</span>
        </div>
      ))}
    </div>
    <div className="bg-slate-800 rounded-lg border border-slate-700/50 px-3 py-2">
      <p className="text-[9px] text-emerald-400 font-bold mb-2 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse inline-block"/>LIVE AUDIT FEED</p>
      {["10:42 — P. Moore viewed PII · Case #DC-2026-44218","10:15 — Aikido Scan PASSED · 0 critical CVEs","09:58 — Mobile Notary Dispatch #D-2894 sent","08:45 — 3x Failed login from 45.33.91.2 BLOCKED"].map((e,i)=>(
        <p key={i} className="text-[9px] text-slate-400 py-0.5 border-b border-slate-700/30 last:border-0">{e}</p>
      ))}
    </div>
  </div>
);

const VisualLicenses = () => (
  <div className="h-full bg-slate-900 p-4 overflow-hidden">
    <div className="grid grid-cols-4 gap-2 mb-3">
      {[{l:"Total",v:"24"},{l:"Active",v:"19",c:"text-emerald-400"},{l:"Expiring <30d",v:"3",c:"text-amber-400"},{l:"MRR",v:"$12.4K",c:"text-amber-400"}].map(k=>(
        <div key={k.l} className="bg-slate-800 rounded-lg p-2 border border-slate-700/50">
          <p className="text-[9px] text-slate-500 uppercase">{k.l}</p>
          <p className={`text-lg font-black ${k.c||"text-white"}`}>{k.v}</p>
        </div>
      ))}
    </div>
    <div className="bg-slate-800 rounded-lg border border-slate-700/50 overflow-hidden">
      <div className="grid grid-cols-5 gap-2 px-3 py-1.5 border-b border-slate-700/50 bg-slate-700/30">
        {["Organization","Product","Status","Seats","Expires"].map(h=><span key={h} className="text-[8px] font-bold uppercase text-slate-500">{h}</span>)}
      </div>
      {[
        {org:"Acme Law LLP",prod:"Sentrix ASM",st:"Active",seats:"8/10",exp:"91d",sc:"text-emerald-400"},
        {org:"Capitol PM",prod:"Dispatch",st:"Active",seats:"3/5",exp:"44d",sc:"text-emerald-400"},
        {org:"MedCare DC",prod:"Compliance LMS",st:"Warning",seats:"5/5",exp:"12d",sc:"text-amber-400"},
        {org:"SecureGov LLC",prod:"SOCaaS",st:"Expired",seats:"2/2",exp:"—",sc:"text-red-400"},
      ].map((r,i)=>(
        <div key={i} className="grid grid-cols-5 gap-2 px-3 py-2 border-b border-slate-700/20 last:border-0">
          <span className="text-[9px] text-white font-semibold truncate">{r.org}</span>
          <span className="text-[9px] text-slate-400">{r.prod}</span>
          <span className={`text-[9px] font-bold ${r.sc}`}>{r.st}</span>
          <span className="text-[9px] text-slate-400">{r.seats}</span>
          <span className={`text-[9px] font-bold ${r.sc}`}>{r.exp}</span>
        </div>
      ))}
    </div>
  </div>
);

const VisualInfra = () => (
  <div className="h-full bg-slate-900 p-4 overflow-hidden">
    <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-red-500/10 border border-red-500/25 rounded-lg">
      <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0"/>
      <p className="text-[10px] text-red-300 font-semibold">3 assets need attention — 1 critical, 2 warning</p>
      <span className="ml-auto text-[9px] text-red-400 font-bold underline">View flagged →</span>
    </div>
    <div className="flex gap-1.5 mb-3">
      {["All (18)","Needs Attention (3)","Critical (1)","Warning (2)","Healthy (15)"].map((t,i)=>(
        <span key={t} className={`px-2 py-1 text-[8px] font-bold rounded border ${i===1?"border-amber-500/40 text-amber-400 bg-amber-500/10":"border-slate-700 text-slate-500"}`}>{t}</span>
      ))}
    </div>
    <div className="bg-slate-800 rounded-lg border border-slate-700/50 overflow-hidden">
      {[
        {name:"DC-FW-01",type:"Firewall",prov:"Azure",st:"Critical",stc:"text-red-400 bg-red-500/10 border-red-500/20",org:"Capitol PM"},
        {name:"PROD-DB-02",type:"Database",prov:"AWS",st:"Warning",stc:"text-amber-400 bg-amber-500/10 border-amber-500/20",org:"Acme Law LLP"},
        {name:"VPN-GATE",type:"VPN",prov:"On Premise",st:"Warning",stc:"text-amber-400 bg-amber-500/10 border-amber-500/20",org:"MedCare DC"},
        {name:"WEB-SRV-01",type:"Server",prov:"GCP",st:"Healthy",stc:"text-emerald-400 bg-emerald-500/10 border-emerald-500/20",org:"Acme Law LLP"},
      ].map((r,i)=>(
        <div key={i} className={`flex items-center gap-3 px-3 py-2 border-b border-slate-700/20 last:border-0 ${["Critical","Warning"].includes(r.st)?"bg-red-500/[0.03] border-l-2 border-l-red-500/40":""}`}>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-white font-semibold">{r.name}</p>
            <p className="text-[8px] text-slate-500">{r.type} · {r.prov}</p>
          </div>
          <span className="text-[8px] text-slate-400 hidden sm:block">{r.org}</span>
          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full border ${r.stc}`}>{r.st}</span>
        </div>
      ))}
    </div>
  </div>
);

const VisualSDLC = () => (
  <div className="h-full bg-slate-900 p-4 overflow-hidden">
    <div className="grid grid-cols-2 gap-2 mb-3">
      {[
        {name:"Sentrix Portal v2",phase:"Development",status:"On Track",pct:65,pc:"bg-blue-500",sc:"text-emerald-400"},
        {name:"SOCaaS Enhancements",phase:"Testing",status:"At Risk",pct:80,pc:"bg-amber-500",sc:"text-amber-400"},
        {name:"Compliance LMS Update",phase:"Design",status:"Blocked",pct:30,pc:"bg-red-500",sc:"text-red-400"},
        {name:"Mobile App MVP",phase:"Planning",status:"On Track",pct:10,pc:"bg-violet-500",sc:"text-emerald-400"},
      ].map((p,i)=>(
        <div key={i} className="bg-slate-800 border border-slate-700/50 rounded-lg p-3">
          <div className="flex items-start justify-between mb-1.5">
            <p className="text-[10px] text-white font-bold">{p.name}</p>
            <span className={`text-[8px] font-bold ${p.sc}`}>{p.status}</span>
          </div>
          <span className="text-[8px] text-slate-500 bg-slate-700/50 rounded px-1.5 py-0.5">{p.phase}</span>
          <div className="mt-2 bg-slate-700 rounded-full h-1">
            <div className={`h-1 rounded-full ${p.pc}`} style={{width:`${p.pct}%`}}/>
          </div>
          <p className="text-[8px] text-slate-500 mt-1">{p.pct}% complete</p>
        </div>
      ))}
    </div>
  </div>
);

const VisualDispatch = () => (
  <div className="h-full bg-slate-900 p-4 overflow-hidden">
    <div className="grid grid-cols-2 gap-2 mb-3">
      {[
        {label:"Book Mobile Notary",color:"bg-blue-500/10 border-blue-500/25 text-blue-400",desc:"Legal"},
        {label:"Request CPTED Audit",color:"bg-emerald-500/10 border-emerald-500/25 text-emerald-400",desc:"Property"},
        {label:"Deploy Drone",color:"bg-violet-500/10 border-violet-500/25 text-violet-400",desc:"Aerial Ops"},
        {label:"Executive Protection",color:"bg-amber-500/10 border-amber-500/25 text-amber-400",desc:"Security"},
      ].map((b,i)=>(
        <div key={i} className={`flex flex-col items-center justify-center p-3 rounded-xl border ${b.color} gap-1`}>
          <div className={`w-8 h-8 rounded-lg border ${b.color} flex items-center justify-center`}>
            <Zap className="w-4 h-4"/>
          </div>
          <span className="text-[10px] font-bold text-center">{b.label}</span>
          <span className="text-[8px] opacity-60">{b.desc}</span>
        </div>
      ))}
    </div>
    <div className="bg-slate-800 rounded-lg border border-slate-700/50">
      <p className="text-[8px] text-slate-500 font-bold uppercase px-3 pt-2 pb-1">Active Dispatches</p>
      {[
        {id:"D-2894",type:"Mobile Notary",client:"Acme Law LLP",st:"In Transit",sc:"text-blue-400"},
        {id:"D-2891",type:"CPTED Audit",client:"Capitol PM",st:"On Site",sc:"text-emerald-400"},
        {id:"D-2887",type:"EP Detail",client:"SecureGov LLC",st:"Completed",sc:"text-slate-400"},
      ].map((d,i)=>(
        <div key={i} className="flex items-center gap-3 px-3 py-2 border-t border-slate-700/30">
          <span className="text-[8px] font-mono text-slate-500">{d.id}</span>
          <span className="text-[9px] text-white flex-1">{d.type}</span>
          <span className="text-[8px] text-slate-400">{d.client}</span>
          <span className={`text-[8px] font-bold ${d.sc}`}>{d.st}</span>
        </div>
      ))}
    </div>
  </div>
);

const VisualPortal = () => (
  <div className="h-full bg-slate-900 p-4 overflow-hidden">
    <div className="flex items-center gap-2 mb-3">
      <div className="w-8 h-8 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center justify-center">
        <Building2 className="w-4 h-4 text-amber-400"/>
      </div>
      <div>
        <p className="text-[11px] text-white font-bold">Acme Law LLP</p>
        <p className="text-[8px] text-slate-500">Client Portal · Professional Plan</p>
      </div>
    </div>
    <div className="grid grid-cols-3 gap-2 mb-3">
      {[{l:"Active Licenses",v:"3",c:"text-emerald-400"},{l:"Projects",v:"2",c:"text-blue-400"},{l:"Reports",v:"6",c:"text-amber-400"}].map(k=>(
        <div key={k.l} className="bg-slate-800 rounded-lg p-2 border border-slate-700/50 text-center">
          <p className={`text-lg font-black ${k.c}`}>{k.v}</p>
          <p className="text-[8px] text-slate-500">{k.l}</p>
        </div>
      ))}
    </div>
    <div className="space-y-2">
      {[
        {name:"Sentrix ASM",seats:"8/10",exp:"91d",stc:"text-emerald-400"},
        {name:"Compliance LMS",seats:"5/5",exp:"12d",stc:"text-amber-400"},
        {name:"Dispatch Module",seats:"2/5",exp:"180d",stc:"text-emerald-400"},
      ].map((l,i)=>(
        <div key={i} className="flex items-center gap-3 bg-slate-800 rounded-lg px-3 py-2 border border-slate-700/50">
          <KeyRound className="w-3.5 h-3.5 text-amber-400 shrink-0"/>
          <span className="text-[10px] text-white font-semibold flex-1">{l.name}</span>
          <span className="text-[8px] text-slate-400">{l.seats} seats</span>
          <span className={`text-[8px] font-bold ${l.stc}`}>{l.exp} left</span>
        </div>
      ))}
    </div>
  </div>
);

const visuals = {
  hero: <VisualHero />,
  dashboard: <VisualDashboard />,
  licenses: <VisualLicenses />,
  infra: <VisualInfra />,
  sdlc: <VisualSDLC />,
  dispatch: <VisualDispatch />,
  portal: <VisualPortal />,
};

export default function DemoVideoModal({ open, onClose }) {
  const [current, setCurrent] = useState(0);
  if (!open) return null;

  const slide = slides[current];
  const isFirst = current === 0;
  const isLast = current === slides.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm px-4" onClick={onClose}>
      <div
        className="relative w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-950"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 px-5 py-3 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-bold text-white tracking-wide">EDS Sentrix ASM — Platform Tour</span>
            <span className="text-[10px] text-slate-500 font-mono ml-2">{current + 1} / {slides.length}</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Slide navigation tabs */}
        <div className="bg-slate-900/80 border-b border-white/5 px-5 flex gap-1 overflow-x-auto">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrent(i)}
              className={`px-3 py-2.5 text-[10px] font-bold whitespace-nowrap border-b-2 transition-colors ${
                i === current
                  ? "border-amber-400 text-amber-400"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              {s.tag}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[380px]">
          {/* Left: description */}
          <div className="p-7 flex flex-col justify-between border-r border-white/5">
            <div>
              <span className="inline-block text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full mb-4">
                {slide.tag}
              </span>
              <h2 className="text-2xl font-black text-white leading-tight mb-1">{slide.title}</h2>
              <p className="text-sm text-amber-300/80 font-medium mb-4">{slide.subtitle}</p>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">{slide.description}</p>
              <ul className="space-y-2.5">
                {slide.highlights.map((h, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-slate-300">
                    <div className="w-6 h-6 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-center shrink-0">
                      <h.icon className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    {h.text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Progress dots */}
            <div className="flex items-center gap-1.5 mt-6">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all ${i === current ? "w-6 bg-amber-400" : "w-1.5 bg-slate-700 hover:bg-slate-500"}`}
                />
              ))}
            </div>
          </div>

          {/* Right: live visual mockup */}
          <div className="min-h-[380px] overflow-hidden">
            {visuals[slide.visual]}
          </div>
        </div>

        {/* Footer / nav */}
        <div className="bg-slate-900 px-5 py-3 flex items-center justify-between border-t border-white/10">
          <span className="text-xs text-slate-500 font-mono">CONFIDENTIAL — EDS Internal Preview Build</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrent(c => c - 1)}
              disabled={isFirst}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-700 disabled:opacity-30 transition-all"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            {isLast ? (
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all"
              >
                Done <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setCurrent(c => c + 1)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}