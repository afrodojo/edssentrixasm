import React from "react";
import { Shield, Cloud, Lock } from "lucide-react";

export default function TrustBanner() {
  return (
    <div className="bg-navy-900/5 border border-navy-200/50 rounded-xl px-5 py-3.5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Cloud className="w-4 h-4" />
        <span className="text-xs font-medium">Secured by Cloudflare</span>
      </div>
      <div className="w-px h-4 bg-border hidden sm:block" />
      <div className="flex items-center gap-2 text-muted-foreground">
        <Shield className="w-4 h-4" />
        <span className="text-xs font-medium">Aikido Security</span>
      </div>
      <div className="w-px h-4 bg-border hidden sm:block" />
      <div className="flex items-center gap-2 text-muted-foreground">
        <Lock className="w-4 h-4" />
        <span className="text-xs font-medium">Powered by Microsoft Azure</span>
      </div>
    </div>
  );
}