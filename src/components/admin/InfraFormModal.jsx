import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { toast } from "sonner";

const ASSET_TYPES = ["server","firewall","router","endpoint","cloud_instance","database","vpn","domain","ssl_cert","other"];
const PROVIDERS = ["azure","aws","gcp","cloudflare","on_premise","other"];
const STATUSES = ["healthy","warning","critical","offline"];

export default function InfraFormModal({ asset, onClose, onSaved }) {
  const [form, setForm] = useState(asset || { asset_type: "server", provider: "azure", status: "healthy", monthly_cost: 0 });
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
    if (!form.asset_name) { toast.error("Asset name is required"); return; }
    if (!form.organization_id) { toast.error("Select an organization"); return; }
    setSaving(true);
    if (asset?.id) {
      await base44.entities.InfraAsset.update(asset.id, form);
      toast.success("Asset updated");
    } else {
      await base44.entities.InfraAsset.create(form);
      toast.success("Asset added");
    }
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-border/60">
          <h2 className="font-bold text-foreground text-lg">{asset ? "Edit Asset" : "Add Infra Asset"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Organization *</label>
            <select value={form.organization_id || ""} onChange={e => handleOrgChange(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-tactical-gold/30">
              <option value="">Select organization...</option>
              {orgs.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Asset Name *</label>
            <input type="text" value={form.asset_name || ""} onChange={e => set("asset_name", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-tactical-gold/30" />
          </div>
          {[
            { key: "asset_type", label: "Asset Type", options: ASSET_TYPES },
            { key: "provider", label: "Provider", options: PROVIDERS },
            { key: "status", label: "Status", options: STATUSES },
          ].map(s => (
            <div key={s.key}>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">{s.label}</label>
              <select value={form[s.key] || s.options[0]} onChange={e => set(s.key, e.target.value)} className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-tactical-gold/30">
                {s.options.map(o => <option key={o} value={o}>{o.replace(/_/g, " ")}</option>)}
              </select>
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Monthly Cost ($)</label>
            <input type="number" value={form.monthly_cost || 0} onChange={e => set("monthly_cost", Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-tactical-gold/30" />
          </div>
          {[
            { key: "ip_address", label: "IP Address", type: "text" },
            { key: "region", label: "Region", type: "text" },
            { key: "os", label: "OS", type: "text" },
            { key: "last_patched", label: "Last Patched", type: "date" },
            { key: "expiry_date", label: "Expiry Date (cert/domain)", type: "date" },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">{f.label}</label>
              <input type={f.type} value={form[f.key] || ""} onChange={e => set(f.key, e.target.value)} className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-tactical-gold/30" />
            </div>
          ))}
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Notes</label>
            <textarea value={form.notes || ""} onChange={e => set("notes", e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-tactical-gold/30 resize-none" />
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