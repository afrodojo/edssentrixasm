import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { toast } from "sonner";

const PRODUCTS = ["sentrix_asm","compliance_lms","dispatch_module","aerial_ops","ep_module","pro_shop","socaas"];

export default function LicenseFormModal({ license, onClose, onSaved }) {
  const [form, setForm] = useState(license || { status: "active", auto_renew: true, seats_licensed: 1, seats_used: 0, unit_price: 0 });
  const [saving, setSaving] = useState(false);

  const { data: orgs = [] } = useQuery({
    queryKey: ["orgs"],
    queryFn: () => base44.entities.Organization.list("-created_date", 100),
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleOrgChange = (id) => {
    const org = orgs.find(o => o.id === id);
    set("organization_id", id);
    set("organization_name", org?.name || "");
  };

  const handleSave = async () => {
    if (!form.organization_id) { toast.error("Select an organization"); return; }
    if (!form.product) { toast.error("Select a product"); return; }
    setSaving(true);
    if (license?.id) {
      await base44.entities.License.update(license.id, form);
      toast.success("License updated");
    } else {
      await base44.entities.License.create(form);
      toast.success("License issued");
    }
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-border/60">
          <h2 className="font-bold text-foreground text-lg">{license ? "Edit License" : "Issue License"}</h2>
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
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Product *</label>
            <select value={form.product || ""} onChange={e => set("product", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-tactical-gold/30">
              <option value="">Select product...</option>
              {PRODUCTS.map(p => <option key={p} value={p}>{p.replace(/_/g, " ")}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Status</label>
              <select value={form.status || "active"} onChange={e => set("status", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-tactical-gold/30">
                {["active","expired","pending","revoked"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Auto-Renew</label>
              <select value={form.auto_renew ? "true" : "false"} onChange={e => set("auto_renew", e.target.value === "true")} className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-tactical-gold/30">
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Seats Licensed</label>
              <input type="number" value={form.seats_licensed || 1} onChange={e => set("seats_licensed", Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-tactical-gold/30" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Price/Seat ($)</label>
              <input type="number" value={form.unit_price || 0} onChange={e => set("unit_price", Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-tactical-gold/30" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Valid From</label>
              <input type="date" value={form.valid_from || ""} onChange={e => set("valid_from", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-tactical-gold/30" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Valid Until</label>
              <input type="date" value={form.valid_until || ""} onChange={e => set("valid_until", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-tactical-gold/30" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">License Key</label>
            <input type="text" value={form.license_key || ""} onChange={e => set("license_key", e.target.value)} placeholder="Auto-generated or custom key" className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground font-mono placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-tactical-gold/30" />
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