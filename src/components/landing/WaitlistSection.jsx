import React, { useState } from "react";
import { ArrowRight, CheckCircle2, Zap, Gift, Tag, LogIn, Clock } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";

const perks = [
  { icon: Gift, text: "First 3 legal dispatches — free" },
  { icon: Tag, text: "Early-bird pricing locked in forever" },
  { icon: Zap, text: "Priority access before public launch" },
];

const industryOptions = [
  { value: "law_firm", label: "Law Firm" },
  { value: "property_management", label: "Property Management" },
  { value: "medical_clinic", label: "Medical Clinic" },
  { value: "corporate", label: "Corporate" },
  { value: "government", label: "Government" },
  { value: "other", label: "Other" },
];

export default function WaitlistSection() {
  const [form, setForm] = useState({ org_name: "", contact_name: "", email: "", phone: "", industry: "", interest: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.includes("@")) { toast.error("Please enter a valid email."); return; }
    if (!form.org_name.trim()) { toast.error("Please enter your organization name."); return; }
    setLoading(true);
    try {
      await base44.functions.invoke("clientSignup", form);
      setSubmitted(true);
    } catch (err) {
      toast.error("Submission failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <section id="waitlist" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(251,191,36,0.07),transparent)]" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-8">
          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
          <span className="text-amber-300 text-xs font-semibold uppercase tracking-wider">Limited Beta Spots Available</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-5">
          Secure Your Spot<br />
          <span className="text-tactical-gold">
            in the EDS Sentrix ASM Beta.
          </span>
        </h2>

        <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
          We're opening EDS Sentrix ASM to a select group of{" "}
          <span className="text-white font-medium">DMV property managers, law firms, and medical clinics.</span>{" "}
          Sign up today to get your first 3 legal dispatches or initial perimeter audit free.
        </p>

        {/* Perks */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          {perks.map((perk, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
              <div className="w-7 h-7 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-center">
                <perk.icon className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <span>{perk.text}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/40">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="text" value={form.org_name} onChange={set("org_name")} required
                  placeholder="Organization name *"
                  className="h-12 px-5 bg-slate-800/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all" />
                <input type="text" value={form.contact_name} onChange={set("contact_name")}
                  placeholder="Your full name"
                  className="h-12 px-5 bg-slate-800/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="email" value={form.email} onChange={set("email")} required
                  placeholder="Business email *"
                  className="h-12 px-5 bg-slate-800/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all" />
                <input type="tel" value={form.phone} onChange={set("phone")}
                  placeholder="Phone number"
                  className="h-12 px-5 bg-slate-800/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select value={form.industry} onChange={set("industry")}
                  className="h-12 px-5 bg-slate-800/60 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all appearance-none"
                  style={{ color: form.industry ? "white" : "rgb(107 114 128)" }}>
                  <option value="" disabled>Industry</option>
                  {industryOptions.map(o => <option key={o.value} value={o.value} className="bg-slate-800 text-white">{o.label}</option>)}
                </select>
                <input type="text" value={form.interest} onChange={set("interest")}
                  placeholder="Services you're interested in"
                  className="h-12 px-5 bg-slate-800/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all" />
              </div>
              <textarea value={form.message} onChange={set("message")} rows={2}
                placeholder="Anything else you'd like us to know? (optional)"
                className="w-full px-5 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all resize-none" />
              <button type="submit" disabled={loading}
                className="w-full h-12 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 font-bold rounded-xl text-sm transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/25 active:scale-95 flex items-center justify-center gap-2">
                {loading ? "Submitting…" : <><span>Apply for Beta Access</span><ArrowRight className="w-4 h-4" /></>}
              </button>
              <p className="text-slate-600 text-xs text-center pt-1">
                Applications reviewed within 24–48 hours · DMV area businesses only
              </p>
            </form>
          ) : (
            <div className="py-6 flex flex-col items-center gap-4">
              <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center">
                <Clock className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="text-white font-bold text-lg">Application Submitted!</h3>
              <p className="text-slate-400 text-sm max-w-sm text-center">
                Your application is under review. Our team will verify your information and respond within 24–48 hours. Check your email for a confirmation.
              </p>
              <div className="w-full border-t border-slate-700/60 pt-4 mt-1 flex flex-col items-center gap-2">
                <p className="text-slate-500 text-xs">Already approved? Access your dashboard below.</p>
                <Link to="/app" className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-sm font-semibold rounded-xl transition-all duration-200 hover:border-amber-500/40">
                  <LogIn className="w-4 h-4" />
                  Sign In to Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}