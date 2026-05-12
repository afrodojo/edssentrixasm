import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { toast } from "sonner";

export default function SDLCFormModal({ project, onClose, onSaved }) {
  const [form, setForm] = useState(project || { phase: "planning", status: "on_track", priority: "medium", completion_pct: 0 });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const { data: orgs = [] } = useQuery({
    queryKey: ["orgs"],
    queryFn: () => base44.entities.Organization.list("-created_date", 100),
  });

  const handleOrgChange = (id) => {
    const org = orgs.find(o => o.id === id);
    set("organization_id", id);
    set("organization_name", org?.name || "");
  };

  const handleSave = async () => {
    if (!form.project_name) { toast.error("Project name is required"); return; }
    if (!form.organization_id) { toast.error("Select an organization"); return; }
    setSaving(true);
    if (project?.id) {
      await base44.entities.SDLCProject.update(project.id, form);
      toast.success("Project updated");
    } else {
      await base44.entities.SDLCProject.create(form);
      toast.success("Project created");
    }
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-border/60">
          <h2 className="font-bold text-foreground text-lg">{project ? "Edit Project" : "New SDLC Project"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Organization *</label>
            <select value={form.organization_id || ""} onChange={e => handleOrgChange(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-tactical-gold/30">
              <option value="">Select organization...</option>
              {orgs.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Project Name *</label>
            <input type="text" value={form.project_name || ""} onChange={e => set("project_name", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-tactical-gold/30" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Description</label>
            <textarea value={form.description || ""} onChange={e => set("description", e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-tactical-gold/30 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: "phase", options: ["planning","requirements","design","development","testing","deployment","maintenance"] },
              { key: "status", options: ["on_track","at_risk","blocked","completed"] },
              { key: "priority", options: ["low","medium","high","critical"] },
            ].map(s => (
              <div key={s.key}>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">{s.key}</label>
                <select value={form[s.key] || s.options[0]} onChange={e => set(s.key, e.target.value)} className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-tactical-gold/30">
                  {s.options.map(o => <option key={o} value={o}>{o.replace(/_/g, " ")}</option>)}
                </select>
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Completion %</label>
              <input type="number" min="0" max="100" value={form.completion_pct ?? 0} onChange={e => set("completion_pct", Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-tactical-gold/30" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Assigned To</label>
              <input type="text" value={form.assigned_to || ""} onChange={e => set("assigned_to", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-tactical-gold/30" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Start Date</label>
              <input type="date" value={form.start_date || ""} onChange={e => set("start_date", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-tactical-gold/30" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Target Date</label>
              <input type="date" value={form.target_date || ""} onChange={e => set("target_date", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-tactical-gold/30" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Tech Stack</label>
            <input type="text" value={form.tech_stack || ""} onChange={e => set("tech_stack", e.target.value)} placeholder="e.g. React, Node.js, Azure" className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-tactical-gold/30" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Repo URL</label>
            <input type="text" value={form.repo_url || ""} onChange={e => set("repo_url", e.target.value)} placeholder="https://github.com/..." className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-tactical-gold/30" />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 pb-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="px-5 py-2 rounded-lg bg-tactical-gold hover:bg-tactical-amber text-navy-900 text-sm font-bold transition-all active:scale-95 disabled:opacity-50">
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}