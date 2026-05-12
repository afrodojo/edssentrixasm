import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { KeyRound, Plus, CheckCircle2, XCircle, Clock, AlertTriangle, Pencil, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { format, parseISO, differenceInDays } from "date-fns";
import LicenseFormModal from "./LicenseFormModal";

const statusConfig = {
  active:  { label: "Active",   color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle2 },
  expired: { label: "Expired",  color: "text-red-400",     bg: "bg-red-500/10 border-red-500/20",         icon: XCircle },
  pending: { label: "Pending",  color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/20",     icon: Clock },
  revoked: { label: "Revoked",  color: "text-slate-400",   bg: "bg-slate-500/10 border-slate-500/20",     icon: AlertTriangle },
};

const productLabels = {
  sentrix_asm: "Sentrix ASM",
  compliance_lms: "Compliance LMS",
  dispatch_module: "Dispatch",
  aerial_ops: "Aerial Ops",
  ep_module: "Exec Protection",
  pro_shop: "Pro Shop",
  socaas: "SOCaaS",
};

function ExpiryBadge({ date }) {
  if (!date) return <span className="text-muted-foreground text-xs">—</span>;
  const days = differenceInDays(parseISO(date), new Date());
  const color = days < 0 ? "text-red-400" : days < 30 ? "text-amber-400" : "text-emerald-400";
  return <span className={`text-xs font-semibold ${color}`}>{days < 0 ? "Expired" : `${days}d left`}<br /><span className="text-muted-foreground font-normal">{format(parseISO(date), "MMM d, yyyy")}</span></span>;
}

export default function LicenseManager() {
  const qc = useQueryClient();
  const [editLic, setEditLic] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const { data: licenses = [], isLoading } = useQuery({
    queryKey: ["licenses"],
    queryFn: () => base44.entities.License.list("-created_date", 200),
  });

  const deleteMut = useMutation({
    mutationFn: (id) => base44.entities.License.delete(id),
    onSuccess: () => { qc.invalidateQueries(["licenses"]); toast.success("License removed"); },
  });

  const renewMut = useMutation({
    mutationFn: ({ id, data }) => base44.entities.License.update(id, data),
    onSuccess: () => { qc.invalidateQueries(["licenses"]); toast.success("License renewed for 1 year"); },
  });

  const handleRenew = (lic) => {
    const from = new Date();
    const until = new Date(from);
    until.setFullYear(until.getFullYear() + 1);
    renewMut.mutate({ id: lic.id, data: { status: "active", valid_from: from.toISOString().split("T")[0], valid_until: until.toISOString().split("T")[0] } });
  };

  // Summary stats
  const total = licenses.length;
  const active = licenses.filter(l => l.status === "active").length;
  const expiringSoon = licenses.filter(l => l.valid_until && differenceInDays(parseISO(l.valid_until), new Date()) < 30 && l.status === "active").length;
  const mrr = licenses.filter(l => l.status === "active").reduce((s, l) => s + (l.unit_price || 0) * (l.seats_licensed || 1), 0);

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Licenses", value: total, color: "text-foreground" },
          { label: "Active", value: active, color: "text-emerald-400" },
          { label: "Expiring < 30d", value: expiringSoon, color: "text-amber-400" },
          { label: "License MRR", value: `$${mrr.toLocaleString()}`, color: "text-tactical-gold" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border/60 rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 bg-tactical-gold hover:bg-tactical-amber text-navy-900 text-sm font-bold rounded-lg transition-all active:scale-95">
          <Plus className="w-4 h-4" /> Issue License
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground text-sm">Loading...</div>
      ) : licenses.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          <KeyRound className="w-10 h-10 mx-auto mb-3 opacity-30" />
          No licenses yet.
        </div>
      ) : (
        <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30">
                  {["Organization","Product","Status","Seats","Expiry","Auto-Renew","Price/Seat","Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {licenses.map(lic => {
                  const s = statusConfig[lic.status] || statusConfig.pending;
                  const SIcon = s.icon;
                  return (
                    <tr key={lic.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3.5 font-semibold text-foreground">{lic.organization_name || lic.organization_id}</td>
                      <td className="px-4 py-3.5 text-muted-foreground">{productLabels[lic.product] || lic.product}</td>
                      <td className="px-4 py-3.5">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${s.bg} ${s.color}`}>
                          <SIcon className="w-3 h-3" />{s.label}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-foreground">{lic.seats_used ?? 0}/{lic.seats_licensed ?? 1}</td>
                      <td className="px-4 py-3.5"><ExpiryBadge date={lic.valid_until} /></td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs font-semibold ${lic.auto_renew ? "text-emerald-400" : "text-slate-500"}`}>
                          {lic.auto_renew ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-foreground font-medium">${(lic.unit_price || 0).toLocaleString()}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <button title="Renew 1 year" onClick={() => handleRenew(lic)} className="p-1.5 hover:bg-emerald-500/10 rounded-lg text-muted-foreground hover:text-emerald-400 transition-colors">
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setEditLic(lic)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => { if (confirm("Remove license?")) deleteMut.mutate(lic.id); }} className="p-1.5 hover:bg-red-500/10 rounded-lg text-muted-foreground hover:text-red-400 transition-colors">
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

      {(showCreate || editLic) && (
        <LicenseFormModal
          license={editLic}
          onClose={() => { setShowCreate(false); setEditLic(null); }}
          onSaved={() => { qc.invalidateQueries(["licenses"]); setShowCreate(false); setEditLic(null); }}
        />
      )}
    </div>
  );
}