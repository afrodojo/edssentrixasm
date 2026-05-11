import React from "react";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, Zap } from "lucide-react";

export default function UpsellBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 p-6 sm:p-8 text-white">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-tactical-gold/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-tactical-red/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="w-14 h-14 bg-tactical-gold/10 border border-tactical-gold/30 rounded-2xl flex items-center justify-center shrink-0">
          <Shield className="w-7 h-7 text-tactical-gold" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-tactical-gold" />
            <span className="text-tactical-gold text-xs font-bold uppercase tracking-wider">Legal Protection</span>
          </div>
          <h3 className="text-lg font-bold mb-1">Right to Bear Legal Defense Coverage</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Ensure your security team is legally protected. Add Right to Bear legal defense coverage to your corporate policy — comprehensive protection for armed and unarmed security personnel.
          </p>
        </div>
        <Button className="bg-tactical-gold text-navy-900 hover:bg-tactical-amber font-bold px-6 shrink-0 shadow-lg shadow-tactical-gold/20">
          Add Coverage
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}