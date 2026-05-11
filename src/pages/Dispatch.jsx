import React from "react";
import DispatchForm from "../components/dispatch/DispatchForm";
import ActiveDispatches from "../components/dispatch/ActiveDispatches";
import { Badge } from "@/components/ui/badge";
import { Radio } from "lucide-react";

export default function Dispatch() {
  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Service Dispatch Center</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Request legal, security, and field services across the DMV</p>
        </div>
        <Badge variant="outline" className="text-xs font-semibold gap-1.5 w-fit">
          <Radio className="w-3 h-3" />
          3 Active Dispatches
        </Badge>
      </div>

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