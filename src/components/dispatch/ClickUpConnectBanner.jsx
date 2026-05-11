import React, { useState } from "react";
import { AlertTriangle, ExternalLink, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

const CONNECTOR_ID = '69ed7eeab69fd772056b323c';

export default function ClickUpConnectBanner({ onConnected }) {
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const url = await base44.connectors.connectAppUser(CONNECTOR_ID);
      const popup = window.open(url, "_blank", "width=600,height=700");
      const timer = setInterval(() => {
        if (!popup || popup.closed) {
          clearInterval(timer);
          setConnecting(false);
          onConnected();
        }
      }, 500);
    } catch {
      setConnecting(false);
    }
  };

  return (
    <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-bold text-foreground">ClickUp Connection Required</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Connect your ClickUp account (EDS Manager workspace) to enable live task creation for dispatch requests.
        </p>
      </div>
      <Button
        size="sm"
        onClick={handleConnect}
        disabled={connecting}
        className="bg-tactical-gold hover:bg-tactical-amber text-navy-900 font-bold shrink-0 gap-1.5"
      >
        {connecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ExternalLink className="w-3.5 h-3.5" />}
        {connecting ? "Connecting..." : "Connect ClickUp"}
      </Button>
    </div>
  );
}