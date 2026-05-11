import React from "react";
import ReadinessScore from "../components/dashboard/ReadinessScore";
import StatsRow from "../components/dashboard/StatsRow";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import TrustBanner from "../components/dashboard/TrustBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Bell } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-7xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Welcome back, John. Here's your operational overview.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>May 11, 2026</span>
          </div>
          <div className="relative w-9 h-9 bg-muted/50 rounded-lg flex items-center justify-center hover:bg-muted transition-colors cursor-pointer">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-tactical-red rounded-full flex items-center justify-center">
              <span className="text-[9px] text-white font-bold">3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Readiness Score */}
      <ReadinessScore />

      {/* Stats */}
      <StatsRow />

      {/* Activity + Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>
        <div>
          <Card className="shadow-sm border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold">Upcoming</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { title: "Quarterly Compliance Review", date: "May 15, 2026", type: "Compliance" },
                { title: "First Aid Recertification", date: "May 22, 2026", type: "Training" },
                { title: "Network Security Audit", date: "Jun 1, 2026", type: "Cyber" },
              ].map((event, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors">
                  <div className="w-10 h-10 bg-navy-900/5 rounded-lg flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-navy-700">{event.date.split(" ")[0].toUpperCase()}</span>
                    <span className="text-sm font-bold text-navy-900">{event.date.split(" ")[1].replace(",", "")}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.type}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trust Banner */}
      <TrustBanner />
    </div>
  );
}