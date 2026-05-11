import React from "react";
import { Shield, Gavel, Eye, ShoppingCart, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Shield,
    color: "from-blue-500/20 to-blue-600/5",
    border: "border-blue-500/20",
    iconBg: "bg-blue-500/10 border-blue-500/20",
    iconColor: "text-blue-400",
    tag: "Training & LMS",
    title: "Continuous Compliance Training",
    body: "Automated employee training for Cyber Threats, Active Shooter Response, and CPR. Download certificates instantly to negotiate lower insurance premiums.",
    cta: "Explore Training",
  },
  {
    icon: Gavel,
    color: "from-amber-500/20 to-amber-600/5",
    border: "border-amber-500/20",
    iconBg: "bg-amber-500/10 border-amber-500/20",
    iconColor: "text-amber-400",
    tag: "Legal Dispatch",
    title: "On-Demand Legal Dispatch",
    body: "Instantly book vetted Mobile Notaries and Process Servers directly to your office or client's location. Uber-style dispatching — track arrival in real-time.",
    cta: "See How It Works",
  },
  {
    icon: Eye,
    color: "from-emerald-500/20 to-emerald-600/5",
    border: "border-emerald-500/20",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    iconColor: "text-emerald-400",
    tag: "Physical Security",
    title: "Physical Perimeter Audits",
    body: "Leverage CPTED standards. Book landscaping and line-of-sight clearing to physically harden your property against threats and reduce liability.",
    cta: "Learn About CPTED",
  },
  {
    icon: ShoppingCart,
    color: "from-violet-500/20 to-violet-600/5",
    border: "border-violet-500/20",
    iconBg: "bg-violet-500/10 border-violet-500/20",
    iconColor: "text-violet-400",
    tag: "Pro Shop",
    title: "Partner Pro Shop",
    body: "Equip your team with discounted 5.11 Tactical gear and Right to Bear legal defense policies directly from your dashboard — B2B pricing, delivered.",
    cta: "Browse Pro Shop",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-slate-800/60 border border-slate-700/50 rounded-full px-4 py-1.5 mb-5">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Platform Overview</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-5">
            The DMV's First<br />
            <span className="bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">
              Unified Readiness Platform
            </span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Everything your business needs to stay compliant, legally covered, physically secure,
            and properly equipped — in one dashboard.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className={`relative group p-6 rounded-2xl bg-gradient-to-b ${f.color} border ${f.border} hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/40 transition-all duration-300 cursor-pointer`}
            >
              <div className={`w-11 h-11 rounded-xl border ${f.iconBg} flex items-center justify-center mb-5`}>
                <f.icon className={`w-5 h-5 ${f.iconColor}`} />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${f.iconColor} mb-2 block`}>
                {f.tag}
              </span>
              <h3 className="text-white font-bold text-base leading-snug mb-3">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-5">{f.body}</p>
              <div className={`flex items-center gap-1.5 text-xs font-semibold ${f.iconColor} group-hover:gap-2.5 transition-all`}>
                <span>{f.cta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}