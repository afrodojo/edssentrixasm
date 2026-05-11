import React, { useState } from "react";
import { ArrowRight, Play, CheckCircle2, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function HeroSection({ onScrollToWaitlist }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) { toast.error("Please enter a valid email."); return; }
    setSubmitted(true);
    toast.success("You're on the list! We'll be in touch soon.");
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(251,191,36,0.07),transparent)]" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-4xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-8">
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
            <span className="text-amber-300 text-xs font-semibold tracking-wider uppercase">Now Accepting Beta Applications — DMV Area</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6">
            <span className="text-white">Enterprise Security</span>
            <br />
            <span className="text-white">&amp; Compliance.</span>
            <br />
            <span className="bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">
              Scaled for DMV Businesses.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-slate-400 text-lg sm:text-xl leading-relaxed mb-4 max-w-2xl mx-auto">
            Stop juggling vendors. EDS Ready Hub is your{" "}
            <span className="text-slate-200 font-medium">single pane of glass</span> for employee safety
            training, cyber compliance, and on-demand legal dispatch in DC, MD, and VA.
          </p>

          {/* Location tag */}
          <div className="flex items-center justify-center gap-1.5 text-slate-500 text-sm mb-10">
            <MapPin className="w-3.5 h-3.5" />
            <span>Serving Washington DC · Maryland · Virginia</span>
          </div>

          {/* Email capture */}
          <div className="max-w-xl mx-auto mb-6">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your business email..."
                  className="flex-1 h-13 px-5 py-3.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                />
                <button
                  type="submit"
                  className="sm:shrink-0 px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/30 active:scale-95 flex items-center justify-center gap-2"
                >
                  Request Beta Access
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-3 h-13 px-6 py-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-300 font-semibold">You're on the list! We'll reach out soon.</span>
              </div>
            )}
          </div>

          {/* Social proof micro-copy */}
          <p className="text-slate-600 text-xs mb-14">
            No credit card required · Only available in DMV area · Limited beta spots
          </p>

          {/* Demo Video Placeholder */}
          <div className="relative max-w-4xl mx-auto">
            {/* Glow */}
            <div className="absolute -inset-4 bg-amber-500/5 blur-2xl rounded-3xl" />
            <div className="relative bg-slate-900 border border-slate-700/60 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 aspect-video flex items-center justify-center group cursor-pointer hover:border-amber-500/40 transition-all duration-500">
              {/* Header bar mock */}
              <div className="absolute top-0 left-0 right-0 h-10 bg-slate-800/80 border-b border-slate-700/50 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                <div className="flex-1 mx-4 h-5 bg-slate-700/50 rounded-md" />
              </div>

              {/* Mock UI lines */}
              <div className="absolute inset-0 pt-10 flex gap-0 opacity-20">
                <div className="w-48 h-full bg-slate-800/60 border-r border-slate-700/40" />
                <div className="flex-1 p-6 space-y-4">
                  <div className="h-4 bg-slate-700/60 rounded w-1/3" />
                  <div className="h-3 bg-slate-700/40 rounded w-2/3" />
                  <div className="grid grid-cols-4 gap-3 mt-6">
                    {[1,2,3,4].map(i => <div key={i} className="h-20 bg-slate-700/40 rounded-lg" />)}
                  </div>
                  <div className="h-28 bg-slate-700/30 rounded-xl mt-4" />
                </div>
              </div>

              {/* Play button */}
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="w-18 h-18 w-20 h-20 bg-white/5 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center group-hover:bg-amber-500/20 group-hover:border-amber-500/40 transition-all duration-300 group-hover:scale-110">
                  <Play className="w-8 h-8 text-white ml-1" fill="white" />
                </div>
                <div className="text-center">
                  <p className="text-slate-300 font-semibold text-sm">Clickable Prototype Demo</p>
                  <p className="text-slate-600 text-xs mt-0.5">UI Mockup · 2 min walkthrough</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}