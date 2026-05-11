import React from "react";
import { ShieldCheck, Gavel, MapPin, ArrowRight } from "lucide-react";

const pillars = [
  {
    icon: ShieldCheck,
    accent: "sky",
    iconBg: "bg-sky-500/10 border-sky-500/20",
    iconColor: "text-sky-400",
    glowColor: "hover:shadow-sky-500/10",
    borderHover: "hover:border-sky-500/30",
    tagColor: "text-sky-400",
    tag: "Training & LMS",
    title: "Continuous Compliance LMS",
    body: "Automated micro-courses for Cyber Awareness, CPR, and Active Shooter response. Keep your staff compliant and negotiate lower insurance premiums with downloadable certificates.",
    metrics: ["40+ Courses", "Certificate Download", "Insurance-ready"],
  },
  {
    icon: Gavel,
    accent: "amber",
    iconBg: "bg-amber-500/10 border-amber-500/20",
    iconColor: "text-amber-400",
    glowColor: "hover:shadow-amber-500/10",
    borderHover: "hover:border-amber-500/30",
    tagColor: "text-amber-400",
    tag: "Legal Dispatch",
    title: "On-Demand Legal Dispatch",
    body: "Stop chasing vendors. Book vetted Mobile Notaries and Process Servers directly to your office with one click. Real-time dispatch tracking included.",
    metrics: ["< 3 min dispatch", "Vetted providers", "Real-time tracking"],
  },
  {
    icon: MapPin,
    accent: "emerald",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    iconColor: "text-emerald-400",
    glowColor: "hover:shadow-emerald-500/10",
    borderHover: "hover:border-emerald-500/30",
    tagColor: "text-emerald-400",
    tag: "Physical Security",
    title: "Physical Security & CPTED",
    body: "Request line-of-sight landscaping and perimeter vulnerability audits. Ensure your physical footprint matches your digital defense using CPTED methodologies.",
    metrics: ["CPTED Standards", "Perimeter Audits", "LOS Clearing"],
  },
];

export default function SentrixPillars() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/30 to-slate-950" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-slate-800/60 border border-slate-700/50 rounded-full px-4 py-1.5 mb-5">
            <span className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">Core Platform</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4">
            Three Pillars.{" "}
            <span className="bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">
              One Platform.
            </span>
          </h2>
          <p className="text-slate-400 text-lg">
            Sentrix unifies the three most neglected layers of SMB security into a single, auditable dashboard.
          </p>
        </div>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((p, i) => (
            <div
              key={i}
              className={`group relative p-7 rounded-2xl bg-slate-900/60 border border-slate-800 ${p.borderHover} hover:bg-slate-900 hover:shadow-2xl ${p.glowColor} transition-all duration-300 cursor-default hover:-translate-y-1`}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl border ${p.iconBg} flex items-center justify-center mb-6`}>
                <p.icon className={`w-6 h-6 ${p.iconColor}`} />
              </div>

              <span className={`text-[10px] font-bold uppercase tracking-widest ${p.tagColor} mb-2 block`}>
                {p.tag}
              </span>
              <h3 className="text-white font-bold text-lg leading-snug mb-3">{p.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">{p.body}</p>

              {/* Metric pills */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {p.metrics.map((m) => (
                  <span
                    key={m}
                    className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700/60 text-slate-400"
                  >
                    {m}
                  </span>
                ))}
              </div>

              <div className={`flex items-center gap-1.5 text-xs font-bold ${p.tagColor} group-hover:gap-2.5 transition-all`}>
                <span>Learn more</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}