import React from "react";
import DispatchForm from "../components/dispatch/DispatchForm";
import ActiveDispatches from "../components/dispatch/ActiveDispatches";
import PIIMaskedField from "../components/security/PIIMaskedField";
import { Badge } from "@/components/ui/badge";
import { Radio, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dispatch() {
  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Legal &amp; Security Dispatch</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Request legal, security, and field services across the DMV</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs font-semibold gap-1.5">
            <Radio className="w-3 h-3" />
            3 Active Dispatches
          </Badge>
          <Badge variant="outline" className="text-xs font-semibold gap-1.5 text-emerald-600 border-emerald-200">
            <ShieldCheck className="w-3 h-3" />
            PII Protected
          </Badge>
        </div>
      </div>

      {/* PII Client Details */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-tactical-gold" />
            <CardTitle className="text-base font-bold">Active Case — Sensitive Client Data</CardTitle>
          </div>
          <p className="text-xs text-muted-foreground">PII fields are masked per SOC 2 controls. Re-authentication required to reveal.</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PIIMaskedField label="Client Full Name" value="Alexandra M. Reynolds" masked="A•••••••• M. R•••••••" />
          <PIIMaskedField label="Service Address" value="3201 New Mexico Ave NW, Washington DC 20016" masked="3••• N•• M•••• A••, W•••••••••" />
          <PIIMaskedField label="Case Reference #" value="Case #DC-2026-44218" masked="Case #DC-••••-•••••" />
          <PIIMaskedField label="Contact Phone" value="+1 (202) 555-0174" masked="+1 (•••) •••-••••" />
        </CardContent>
      </Card>

      {/* Form + Active */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <DispatchForm />
        </div>
        <div className="lg:col-span-2">
          <ActiveDispatches />
        </div>
      </div>
    </div>
  );
}