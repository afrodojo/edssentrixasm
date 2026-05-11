import React from "react";
import { ShieldCheck, Bell, ChevronDown } from "lucide-react";

export default function TopBar() {
  return (
    <div className="hidden lg:flex fixed top-0 left-64 right-0 z-30 h-12 bg-card/80 backdrop-blur-sm border-b border-border/60 items-center justify-end px-6 gap-3">
      {/* MFA Badge */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-400">
        <ShieldCheck className="w-3 h-3" />
        MFA Verified
      </div>
      {/* Zero Trust Badge */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-tactical-gold/10 border border-tactical-gold/20 rounded-full text-[10px] font-bold text-tactical-gold">
        <div className="w-1.5 h-1.5 bg-tactical-gold rounded-full animate-pulse" />
        Zero Trust Active
      </div>
      {/* Notification bell */}
      <div className="relative w-8 h-8 bg-muted/50 rounded-lg flex items-center justify-center hover:bg-muted transition-colors cursor-pointer">
        <Bell className="w-3.5 h-3.5 text-muted-foreground" />
        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-tactical-red rounded-full flex items-center justify-center">
          <span className="text-[8px] text-white font-bold">3</span>
        </div>
      </div>
      {/* User chip */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/40 rounded-lg cursor-pointer hover:bg-muted transition-colors">
        <div className="w-6 h-6 bg-navy-700 rounded-full flex items-center justify-center text-[10px] font-bold text-white">JD</div>
        <span className="text-xs font-semibold text-foreground">John Doe</span>
        <ChevronDown className="w-3 h-3 text-muted-foreground" />
      </div>
    </div>
  );
}