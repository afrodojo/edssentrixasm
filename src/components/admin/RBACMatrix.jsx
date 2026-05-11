import React, { useState } from "react";
import { Shield, Check, X } from "lucide-react";
import { toast } from "sonner";

const users = [
  { name: "J. Doe", role: "Admin", avatar: "JD" },
  { name: "M. Carter", role: "Dispatcher", avatar: "MC" },
  { name: "A. Williams", role: "Staff", avatar: "AW" },
  { name: "R. Singh", role: "Staff", avatar: "RS" },
  { name: "T. Hassan", role: "Viewer", avatar: "TH" },
];

const permissions = [
  { key: "dispatch_legal", label: "Dispatch Legal" },
  { key: "view_pii", label: "View PII" },
  { key: "request_aerial", label: "Request Aerial Ops" },
  { key: "book_ep", label: "Book Exec Protection" },
  { key: "manage_training", label: "Manage Training" },
  { key: "export_reports", label: "Export Reports" },
  { key: "manage_users", label: "Manage Users" },
];

const defaultMatrix = {
  "J. Doe":      { dispatch_legal: true,  view_pii: true,  request_aerial: true,  book_ep: true,  manage_training: true,  export_reports: true,  manage_users: true  },
  "M. Carter":   { dispatch_legal: true,  view_pii: false, request_aerial: false, book_ep: false, manage_training: false, export_reports: false, manage_users: false },
  "A. Williams": { dispatch_legal: false, view_pii: false, request_aerial: false, book_ep: false, manage_training: true,  export_reports: false, manage_users: false },
  "R. Singh":    { dispatch_legal: false, view_pii: false, request_aerial: true,  book_ep: false, manage_training: false, export_reports: false, manage_users: false },
  "T. Hassan":   { dispatch_legal: false, view_pii: false, request_aerial: false, book_ep: false, manage_training: false, export_reports: false, manage_users: false },
};

export default function RBACMatrix() {
  const [matrix, setMatrix] = useState(defaultMatrix);

  const toggle = (userName, permKey) => {
    setMatrix(prev => ({
      ...prev,
      [userName]: { ...prev[userName], [permKey]: !prev[userName][permKey] }
    }));
    toast.success(`Permission updated for ${userName}`);
  };

  return (
    <div className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-border/60">
        <Shield className="w-5 h-5 text-tactical-gold" />
        <div>
          <h3 className="font-bold text-foreground">User Roles &amp; Permissions</h3>
          <p className="text-xs text-muted-foreground">Toggle access controls per staff member. All changes are audit-logged.</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30">
              <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-muted-foreground w-44">Staff Member</th>
              {permissions.map(p => (
                <th key={p.key} className="text-center px-3 py-3 text-xs font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                  {p.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {users.map(user => (
              <tr key={user.name} className="hover:bg-muted/20 transition-colors">
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center text-xs font-black text-tactical-gold shrink-0">
                      {user.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{user.name}</p>
                      <p className="text-[10px] text-muted-foreground">{user.role}</p>
                    </div>
                  </div>
                </td>
                {permissions.map(p => {
                  const enabled = matrix[user.name]?.[p.key];
                  return (
                    <td key={p.key} className="text-center px-3 py-3.5">
                      <button
                        onClick={() => toggle(user.name, p.key)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto transition-all duration-150 border ${
                          enabled
                            ? "bg-emerald-500/15 border-emerald-500/30 hover:bg-emerald-500/25 text-emerald-400"
                            : "bg-muted/40 border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                        title={enabled ? `Revoke "${p.label}" from ${user.name}` : `Grant "${p.label}" to ${user.name}`}
                      >
                        {enabled ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3 bg-muted/20 border-t border-border/60 flex items-center gap-2 text-xs text-muted-foreground">
        <Shield className="w-3.5 h-3.5 text-tactical-gold" />
        RBAC changes are immutably logged in the Security &amp; Audit Log per NIST SP 800-53 AC-2.
      </div>
    </div>
  );
}