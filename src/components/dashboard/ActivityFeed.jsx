import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, FileCheck, ShieldCheck, Truck, UserCheck, AlertTriangle } from "lucide-react";

const activities = [
  { icon: GraduationCap, text: "John Doe completed First Aid/CPR training", time: "12 min ago", type: "training", color: "text-emerald-500 bg-emerald-50" },
  { icon: Truck, text: "Notary dispatched to Office B — Arlington, VA", time: "34 min ago", type: "dispatch", color: "text-blue-500 bg-blue-50" },
  { icon: FileCheck, text: "Cyber compliance audit passed — Q2 2026", time: "1 hr ago", type: "compliance", color: "text-violet-500 bg-violet-50" },
  { icon: ShieldCheck, text: "Physical security walkthrough completed — Bethesda HQ", time: "2 hrs ago", type: "security", color: "text-tactical-gold bg-amber-50" },
  { icon: AlertTriangle, text: "Emergency process server dispatched — DC District Court", time: "3 hrs ago", type: "urgent", color: "text-tactical-red bg-red-50" },
  { icon: UserCheck, text: "Sarah Chen onboarded — Workplace Violence Response cert", time: "5 hrs ago", type: "training", color: "text-emerald-500 bg-emerald-50" },
];

const typeLabels = {
  training: "Training",
  dispatch: "Dispatch",
  compliance: "Compliance",
  security: "Security",
  urgent: "Urgent",
};

export default function ActivityFeed() {
  return (
    <Card className="shadow-sm border-border/60">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0 p-0">
        {activities.map((activity, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3.5 px-6 py-3.5 border-b border-border/40 last:border-b-0 hover:bg-muted/40 transition-colors"
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${activity.color}`}>
              <activity.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground leading-snug">{activity.text}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">{activity.time}</span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-medium">
                  {typeLabels[activity.type]}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}