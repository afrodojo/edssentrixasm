import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { X } from "lucide-react";
import { toast } from "sonner";

const FIELDS = [
  { key: "name", label: "Organization Name", type: "text", required: true },
  { key: "domain", label: "Domain", type: "text", placeholder: "acme.com" },
  { key: "contact_name", label: "Contact Name", type: "text" },
  { key: "contact_email", label: "Contact Email", type: "email" },
  { key: "contact_phone", label: "Contact Phone", type: "text" },
  { key: "seat_count", label: "Seat Count", type: "number" },
  { key: "monthly_revenue", label: "Monthly Revenue ($)", type: "number" },
  { key: "notes", label: "Notes", type: "textarea" },
];

const SELECTS = [
  { key: "industry", label: "Industry", options: ["law_firm","property_management","medical_clinic","corporate","government","other"] },
  { key: "plan", label: "Plan", options: ["starter","professional","enterprise"] },
  { key: "status", label: "Status", options: ["active","trial","suspended","churned"] },
  { key: "billing_cycle", label: "Billing Cycle", options: ["monthly","annual"] },
];

export default function OrgFormModal({ org, onClose, onSaved }) {
  const [form, setForm] = useState(org || { plan: "starter", status: "trial", billing_cycle: "monthly", industry: "corporate" });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.name) { toast.error("Organization name is required"); return; }
    setSaving(true);
    if (org?.id) {
      await base44.entities.Organization.update(org.id, form);
      toast.success("Organization updated");
    } else {
      await base44.entities.Organization.create(form);
      toast.success("Organization created");
    }
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-border/60">
          <h2 className="font-bold text-foreground text-lg">{org ? "Edit Organization" : "Add Organization"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FIELDS.map(f => (
            <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                {f.label}{f.required && <span className="text-red-400 ml-1">*</span>}
              </label>
              {f.type === "textarea" ? (
                <textarea
                  value={form[f.key] || ""}
                  onChange={e => set(f.key, e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-tactical-gold/30 resize-none"
                />
              ) : (
                <input
                  type={f.type}
                  value={form[f.key] || ""}
                  onChange={e => set(f.key, f.type === "number" ? Number(e.target.value) : e.target.value)}
                  placeholder={f.placeholder || ""}
                  className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-tactical-gold/30"
                />
              )}
            </div>
          ))}
          {SELECTS.map(s => (
            <div key={s.key}>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">{s.label}</label>
              <select
                value={form[s.key] || s.options[0]}
                onChange={e => set(s.key, e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-tactical-gold/30"
              >
                {s.options.map(o => <option key={o} value={o}>{o.replace(/_/g, " ")}</option>)}
              </select>
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Next Billing Date</label>
            <input
              type="date"
              value={form.next_billing_date || ""}
              onChange={e => set("next_billing_date", e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-tactical-gold/30"
            />
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