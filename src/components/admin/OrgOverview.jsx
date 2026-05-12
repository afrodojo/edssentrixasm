import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Building2, Plus, Search, MoreVertical, CheckCircle2, AlertTriangle, XCircle, Clock, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import OrgFormModal from "./OrgFormModal";

const statusConfig = {
  active:    { label: "Active",    color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle2 },
  trial:     { label: "Trial",     color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/20",   icon: Clock },
  suspended: { label: "Suspended", color: "text-red-400",     bg: "bg-red-500/10 border-red-500/20",       icon: AlertTriangle },
  churned:   { label: "Churned",   color: "text-slate-400",   bg: "bg-slate-500/10 border-slate-500/20",   icon: XCircle },
};

const planColors = {
  starter:      "text-slate-300 bg-slate-700/40 border-slate-600",
  professional: "text-blue-300 bg-blue-500/10 border-blue-500/20",
  enterprise:   "text-tactical-gold bg-tactical-gold/10 border-tactical-gold/30",
};

export default function OrgOverview() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [editOrg, setEditOrg] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const { data: orgs = [], isLoading } = useQuery({
    queryKey: ["orgs"],
    queryFn: () => base44.entities.Organization.list("-created_date", 100),
  });

  const deleteMut = useMutation({
    mutationFn: (id) => base44.entities.Organization.delete(id),
    onSuccess: () => { qc.invalidateQueries(["orgs"]); toast.success("Organization removed"); },
  });

  const filtered = orgs.filter(o =>
    o.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.domain?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search organizations..."
            className="w-full pl-9 pr-4 h-9 rounded-lg bg-muted/40 border border-border text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-tactical-gold/30"
          />
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-tactical-gold hover:bg-tactical-amber text-navy-900 text-sm font-bold rounded-lg transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add Organization
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground text-sm">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
          No organizations yet. Add your first client.
        </div>
      ) : (
        <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30">
                  {["Organization","Plan","Status","Seats","MRR","Billing","Contact","Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filtered.map(org => {
                  const s = statusConfig[org.status] || statusConfig.trial;
                  const SIcon = s.icon;
                  return (
                    <tr key={org.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3.5">
                        <div>
                          <p className="font-semibold text-foreground">{org.name}</p>
                          <p className="text-xs text-muted-foreground">{org.domain || "—"}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${planColors[org.plan] || planColors.starter}`}>
                          {org.plan}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${s.bg} ${s.color}`}>
                          <SIcon className="w-3 h-3" />
                          {s.label}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-foreground font-medium">{org.seat_count ?? 1}</td>
                      <td className="px-4 py-3.5 text-emerald-400 font-bold">${(org.monthly_revenue ?? 0).toLocaleString()}</td>
                      <td className="px-4 py-3.5 text-muted-foreground text-xs capitalize">{org.billing_cycle || "monthly"}</td>
                      <td className="px-4 py-3.5">
                        <p className="text-foreground text-xs">{org.contact_name || "—"}</p>
                        <p className="text-muted-foreground text-[10px]">{org.contact_email || ""}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setEditOrg(org)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => { if (confirm("Remove this organization?")) deleteMut.mutate(org.id); }} className="p-1.5 hover:bg-red-500/10 rounded-lg text-muted-foreground hover:text-red-400 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(showCreate || editOrg) && (
        <OrgFormModal
          org={editOrg}
          onClose={() => { setShowCreate(false); setEditOrg(null); }}
          onSaved={() => { qc.invalidateQueries(["orgs"]); setShowCreate(false); setEditOrg(null); }}
        />
      )}
    </div>
  );
}