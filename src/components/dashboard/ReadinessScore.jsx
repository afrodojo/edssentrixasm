import React from "react";
import { Shield, Wifi, Scale, Building2 } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  { label: "Cyber", score: 82, icon: Wifi, color: "text-blue-400", bg: "bg-blue-400" },
  { label: "Physical", score: 74, icon: Building2, color: "text-emerald-400", bg: "bg-emerald-400" },
  { label: "Legal", score: 91, icon: Scale, color: "text-violet-400", bg: "bg-violet-400" },
];

export default function ReadinessScore() {
  const overallScore = Math.round(categories.reduce((a, c) => a + c.score, 0) / categories.length);

  return (
    <div className="bg-navy-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10">
          {/* Score Circle */}
          <div className="relative">
            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
              <motion.circle
                cx="60" cy="60" r="52" fill="none" stroke="#F59E0B" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 52}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - overallScore / 100) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-tactical-gold">{overallScore}</span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">Score</span>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-tactical-gold" />
              <h2 className="text-lg font-bold tracking-tight">EDS Readiness Score</h2>
            </div>
            <p className="text-slate-400 text-sm mb-5">Combined compliance score across all operational domains</p>

            <div className="space-y-3">
              {categories.map((cat) => (
                <div key={cat.label} className="flex items-center gap-3">
                  <cat.icon className={`w-4 h-4 ${cat.color} shrink-0`} />
                  <span className="text-sm text-slate-300 w-16">{cat.label}</span>
                  <div className="flex-1 h-2 bg-navy-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${cat.bg} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.score}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-white w-10 text-right">{cat.score}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}