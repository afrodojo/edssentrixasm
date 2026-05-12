import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GitBranch, Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import SDLCFormModal from "./SDLCFormModal";

const phaseColors = {
  planning:     "bg-slate-500/10 border-slate-500/20 text-slate-300",
  requirements: "bg-violet-500/10 border-violet-500/20 text-violet-300",
  design:       "bg-blue-500/10 border-blue-500/20 text-blue-300",
  development:  "bg-amber-500/10 border-amber-500/20 text-amber-300",
  testing:      "bg-orange-500/10 border-orange-500/20 text-orange-300",
  deployment:   "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",
  maintenance:  "bg-teal-500/10 border-teal-500/20 text-teal-300",
};

const statusColors = {
  on_track: "text-emerald-400",
  at_risk:  "text-amber-400",
  blocked:  "text-red-400",
  completed:"text-slate-400",
};

const priorityColors = {
  low:      "text-slate-400",
  medium:   "text-blue-400",
  high:     "text-amber-400",
  critical: "text-red-400",
};

function ProgressBar({ pct }) {
  return (
    <div className="w-full bg-muted/40 rounded-full h-1.5 mt-1">
      <div
        className={`h-1.5 rounded-full transition-all ${pct >= 100 ? "bg-emerald-500" : pct >= 60 ? "bg-blue-500" : pct >= 30 ? "bg-amber-500" : "bg-red-500"}`}
        style={{ width: `${Math.min(pct, 100)}%` }}
      />
    </div>
  );
}

export default function SDLCTracker() {
  const qc = useQueryClient();
  const [editProject, setEditProject] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["sdlc"],
    queryFn: () => base44.entities.SDLCProject.list("-created_date", 100),
  });

  const deleteMut = useMutation({
    mutationFn: (id) => base44.entities.SDLCProject.delete(id),
    onSuccess: () => { qc.invalidateQueries(["sdlc"]); toast.success("Project removed"); },
  });

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 bg-tactical-gold hover:bg-tactical-amber text-navy-900 text-sm font-bold rounded-lg transition-all active:scale-95">
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground text-sm">Loading...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          <GitBranch className="w-10 h-10 mx-auto mb-3 opacity-30" />
          No SDLC projects tracked yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map(proj => (
            <div key={proj.id} className="bg-card border border-border/60 rounded-xl p-5 hover:border-border transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground truncate">{proj.project_name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{proj.organization_name || "—"}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  {proj.repo_url && (
                    <a href={proj.repo_url} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button onClick={() => setEditProject(proj)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => { if (confirm("Remove project?")) deleteMut.mutate(proj.id); }} className="p-1.5 hover:bg-red-500/10 rounded-lg text-muted-foreground hover:text-red-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${phaseColors[proj.phase] || phaseColors.planning}`}>
                  {proj.phase?.replace(/_/g, " ")}
                </span>
                <span className={`text-xs font-semibold ${priorityColors[proj.priority] || "text-blue-400"}`}>
                  {proj.priority?.toUpperCase()}
                </span>
              </div>

              {proj.description && (
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{proj.description}</p>
              )}

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className={`font-bold ${statusColors[proj.status] || "text-emerald-400"}`}>
                    {proj.completion_pct ?? 0}% · {proj.status?.replace(/_/g, " ")}
                  </span>
                </div>
                <ProgressBar pct={proj.completion_pct ?? 0} />
              </div>

              {proj.assigned_to && (
                <p className="text-xs text-muted-foreground mt-3">Assigned: <span className="text-foreground font-medium">{proj.assigned_to}</span></p>
              )}
              {proj.target_date && (
                <p className="text-xs text-muted-foreground">Target: <span className="text-foreground">{proj.target_date}</span></p>
              )}
            </div>
          ))}
        </div>
      )}

      {(showCreate || editProject) && (
        <SDLCFormModal
          project={editProject}
          onClose={() => { setShowCreate(false); setEditProject(null); }}
          onSaved={() => { qc.invalidateQueries(["sdlc"]); setShowCreate(false); setEditProject(null); }}
        />
      )}
    </div>
  );
}