import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, TrendingUp, AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";

export default function SecurityPostureScore() {
  const [sortBy, setSortBy] = useState("score"); // "score" | "name"

  const { data: orgs = [] } = useQuery({
    queryKey: ["orgs"],
    queryFn: () => base44.entities.Organization.list(),
  });

  const { data: infraAssets = [] } = useQuery({
    queryKey: ["infraAssets"],
    queryFn: () => base44.entities.InfraAsset.list(),
  });

  // Calculate security posture score for each org
  const postures = useMemo(() => {
    return orgs.map((org) => {
      const orgAssets = infraAssets.filter((a) => a.organization_id === org.id);

      if (orgAssets.length === 0) {
        return { org, assets: 0, score: 0, health: [], breakdown: {} };
      }

      // Score calculation:
      // - Healthy = 100 pts
      // - Warning = 60 pts
      // - Critical = 20 pts
      // - Offline = 0 pts
      const maxScore = orgAssets.length * 100;
      let earnedScore = 0;
      const healthCounts = { healthy: 0, warning: 0, critical: 0, offline: 0 };

      orgAssets.forEach((asset) => {
        const status = asset.status || "healthy";
        healthCounts[status]++;
        switch (status) {
          case "healthy":
            earnedScore += 100;
            break;
          case "warning":
            earnedScore += 60;
            break;
          case "critical":
            earnedScore += 20;
            break;
          case "offline":
            earnedScore += 0;
            break;
          default:
            earnedScore += 100;
        }
      });

      const scorePercent = Math.round((earnedScore / maxScore) * 100);
      const health = [
        { label: "Healthy", count: healthCounts.healthy, color: "text-emerald-400 bg-emerald-500/10" },
        { label: "Warning", count: healthCounts.warning, color: "text-amber-400 bg-amber-500/10" },
        { label: "Critical", count: healthCounts.critical, color: "text-red-400 bg-red-500/10" },
        { label: "Offline", count: healthCounts.offline, color: "text-slate-400 bg-slate-500/10" },
      ];

      return { org, assets: orgAssets.length, score: scorePercent, health, breakdown: healthCounts };
    });
  }, [orgs, infraAssets]);

  const sorted = useMemo(() => {
    const copy = [...postures];
    if (sortBy === "score") {
      return copy.sort((a, b) => b.score - a.score);
    } else {
      return copy.sort((a, b) => a.org.name.localeCompare(b.org.name));
    }
  }, [postures, sortBy]);

  const avgScore = postures.length > 0 ? Math.round(postures.reduce((sum, p) => sum + p.score, 0) / postures.length) : 0;
  const criticalCount = sorted.filter((p) => p.score < 70).length;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-sm border-border/60">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Avg Security Score</p>
                <p className="text-3xl font-black text-foreground mt-1">{avgScore}%</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/60">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Organizations</p>
                <p className="text-3xl font-black text-foreground mt-1">{orgs.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`shadow-sm border-border/60 ${criticalCount > 0 ? "border-red-500/30 bg-red-500/5" : ""}`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">At Risk (&lt; 70%)</p>
                <p className={`text-3xl font-black mt-1 ${criticalCount > 0 ? "text-red-400" : "text-emerald-400"}`}>
                  {criticalCount}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${criticalCount > 0 ? "bg-red-500/10" : "bg-emerald-500/10"}`}>
                {criticalCount > 0 ? (
                  <AlertTriangle className={`w-6 h-6 ${criticalCount > 0 ? "text-red-400" : "text-emerald-400"}`} />
                ) : (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Organization List */}
      <Card className="shadow-sm border-border/60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold">Organization Security Posture</CardTitle>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSortBy("score")}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                  sortBy === "score"
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-muted border-border/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                By Score
              </button>
              <button
                onClick={() => setSortBy("name")}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                  sortBy === "name"
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-muted border-border/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                By Name
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {sorted.map((p, i) => {
            const scoreColor =
              p.score >= 85 ? "text-emerald-400" : p.score >= 70 ? "text-amber-400" : "text-red-400";
            const scoreRing =
              p.score >= 85 ? "bg-emerald-500/10 border-emerald-500/20" : p.score >= 70 ? "bg-amber-500/10 border-amber-500/20" : "bg-red-500/10 border-red-500/20";
            return (
              <div key={i} className="flex items-center justify-between p-3.5 rounded-lg border border-border/30 hover:bg-muted/30 transition-all">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 text-xs font-bold text-muted-foreground">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{p.org.name}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {p.health.map(
                        (h, j) =>
                          h.count > 0 && (
                            <span key={j} className={`text-[10px] font-semibold px-2 py-1 rounded border ${h.color}`}>
                              {h.count} {h.label}
                            </span>
                          )
                      )}
                      <span className="text-[10px] text-muted-foreground">{p.assets} assets</span>
                    </div>
                  </div>
                </div>

                {/* Score Ring + Percent */}
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <div className={`relative w-16 h-16 rounded-full border-4 flex items-center justify-center ${scoreRing}`}>
                    <svg className="absolute inset-0 w-16 h-16" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" opacity="0.1" />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray={`${(p.score / 100) * 282.7} 282.7`}
                        strokeLinecap="round"
                        className={scoreColor}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <span className={`text-xl font-black ${scoreColor}`}>{p.score}%</span>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-black ${scoreColor}`}>
                      {p.score >= 85 ? "Excellent" : p.score >= 70 ? "Good" : "At Risk"}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {p.breakdown.healthy}/{p.assets} healthy
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          {sorted.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No organizations found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}