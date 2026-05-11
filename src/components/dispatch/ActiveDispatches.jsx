import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, User } from "lucide-react";

const dispatches = [
  { service: "Mobile Notary", location: "1401 H St NW, Washington DC", agent: "Maria Lopez", status: "en_route", eta: "15 min" },
  { service: "Process Server", location: "DC District Court, 333 Constitution Ave", agent: "James Wright", status: "in_progress", eta: "On-site" },
  { service: "Security Audit", location: "4800 Hampden Ln, Bethesda MD", agent: "EDS Team Alpha", status: "scheduled", eta: "Tomorrow 9:00 AM" },
];

const statusStyles = {
  en_route: "bg-blue-50 text-blue-700 border-blue-200",
  in_progress: "bg-emerald-50 text-emerald-700 border-emerald-200",
  scheduled: "bg-slate-100 text-slate-600 border-slate-200",
};

const statusLabels = {
  en_route: "En Route",
  in_progress: "In Progress",
  scheduled: "Scheduled",
};

export default function ActiveDispatches() {
  return (
    <Card className="shadow-sm border-border/60">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold">Active Dispatches</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {dispatches.map((d, i) => (
          <div key={i} className="p-4 rounded-xl border border-border/60 hover:border-border hover:shadow-sm transition-all">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-sm">{d.service}</h4>
              <Badge variant="outline" className={`text-[10px] ${statusStyles[d.status]}`}>
                {statusLabels[d.status]}
              </Badge>
            </div>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                <span>{d.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-3 h-3" />
                <span>{d.agent}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                <span>ETA: {d.eta}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}