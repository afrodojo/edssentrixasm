import React from "react";
import { ArrowRight, Play, Zap, Lock, Activity } from "lucide-react";

const statItems = [
  { value: "3 min", label: "Avg. dispatch time" },
  { value: "99.9%", label: "Platform uptime" },
  { value: "40+", label: "Compliance modules" },
];

export default function SentrixHero() {
  const scrollToWaitlist = () => {
    document.getElementById("sentrix-waitlist")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-8 pb-16">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#060d1f] to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_60%_40%,rgba(56,189,248,0.06),transparent)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />
      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* LEFT — Text */}
          <div>
            {/* Product badge */}
            <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/25 rounded-full px-4 py-1.5 mb-7">
              <div className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse" />
              <span className="text-sky-300 text-xs font-bold uppercase tracking-widest">
                Sentrix · by Emerging Defense Solutions
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight leading-[1.08] mb-6">
              <span className="text-white">Meet Sentrix.</span>
              <br />
              <span className="bg-gradient-to-r from-sky-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                The Operating System
              </span>
              <br />
              <span className="text-white">for Your Perimeter.</span>
            </h1>

            {/* Body */}
            <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-lg">
              Cyber threats, workplace safety, and legal logistics shouldn't require ten different vendors.
              Sentrix is the DMV's first unified platform built to manage your{" "}
              <span className="text-slate-200 font-medium">employee training, physical security audits, and on-demand legal dispatch</span>{" "}
              in one secure dashboard.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <button
                onClick={scrollToWaitlist}
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl text-sm transition-all duration-200 hover:shadow-xl hover:shadow-sky-500/25 active:scale-95"
              >
                Join the Beta Waitlist
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-transparent hover:bg-slate-800/60 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold rounded-xl text-sm transition-all duration-200">
                <div className="w-6 h-6 bg-slate-700 group-hover:bg-slate-600 rounded-full flex items-center justify-center transition-colors">
                  <Play className="w-3 h-3 ml-0.5" fill="currentColor" />
                </div>
                Watch the Demo
              </button>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-6 pt-6 border-t border-slate-800">
              {statItems.map((s, i) => (
                <div key={i}>
                  <p className="text-xl font-black text-white">{s.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — UI Mockup */}
          <div className="relative">
            {/* Outer glow */}
            <div className="absolute -inset-6 bg-sky-500/5 blur-3xl rounded-full" />

            <div className="relative bg-slate-900 border border-slate-700/60 rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-5 py-3.5 bg-slate-800/80 border-b border-slate-700/50">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                <div className="flex-1 mx-4 h-5 bg-slate-700/50 rounded-md flex items-center px-2">
                  <span className="text-[10px] text-slate-500">sentrix.emergingdefensesolutions.com/dashboard</span>
                </div>
                <Lock className="w-3 h-3 text-emerald-400" />
              </div>

              {/* Dashboard mock */}
              <div className="flex h-72 sm:h-80">
                {/* Sidebar mock */}
                <div className="w-14 bg-[#060d1f] border-r border-slate-800 flex flex-col items-center pt-4 gap-3">
                  {([Activity, Lock, Zap, Play]).map((NavIcon, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${i === 0 ? "bg-sky-500/20" : "bg-slate-800/60"}`}
                    >
                      <NavIcon className={`w-4 h-4 ${i === 0 ? "text-sky-400" : "text-slate-600"}`} />
                    </div>
                  ))}
                </div>

                {/* Main content mock */}
                <div className="flex-1 p-5 space-y-4">
                  {/* Score bar */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="h-3 bg-slate-800 rounded w-32" />
                    <div className="h-3 bg-sky-500/30 rounded w-12" />
                  </div>
                  {/* Big score */}
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-black text-white">84</span>
                    <span className="text-slate-500 text-sm mb-1">/100 Readiness Score</span>
                  </div>
                  {/* Progress bars */}
                  <div className="space-y-2.5">
                    {[
                      { label: "Cyber", val: 82, color: "bg-sky-500" },
                      { label: "Physical", val: 74, color: "bg-emerald-500" },
                      { label: "Legal", val: 91, color: "bg-violet-500" },
                    ].map(b => (
                      <div key={b.label} className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-500 w-12">{b.label}</span>
                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full">
                          <div className={`h-full ${b.color} rounded-full`} style={{ width: `${b.val}%` }} />
                        </div>
                        <span className="text-[10px] text-slate-400 w-6 text-right">{b.val}</span>
                      </div>
                    ))}
                  </div>
                  {/* Cards row */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {["Training", "Dispatch", "Audits"].map((label, i) => (
                      <div key={label} className="bg-slate-800/60 rounded-lg p-2.5 border border-slate-700/40">
                        <div className={`h-1 w-8 rounded mb-2 ${["bg-sky-500", "bg-amber-500", "bg-emerald-500"][i]}`} />
                        <p className="text-[10px] text-slate-400">{label}</p>
                        <p className="text-xs font-bold text-white mt-0.5">{["12/14", "3 Active", "2 Due"][i]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="px-5 py-2.5 bg-slate-800/40 border-t border-slate-700/40 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-[10px] text-slate-500">All systems operational · Last synced 2 min ago</span>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 bg-sky-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-sky-500/30 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Real-time Monitoring
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}