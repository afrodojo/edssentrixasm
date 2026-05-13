import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { CheckCircle2, XCircle, Clock, Building2, Mail, Phone, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

const statusConfig = {
  pending:  { label: "Pending Review", color: "text-amber-400",  bg: "bg-amber-500/10 border-amber-500/20",  icon: Clock },
  approved: { label: "Approved",       color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle2 },
  rejected: { label: "Rejected",       color: "text-red-400",    bg: "bg-red-500/10 border-red-500/20",       icon: XCircle },
};

const industryLabels = {
  law_firm: "Law Firm", property_management: "Property Management",
  medical_clinic: "Medical Clinic", corporate: "Corporate",
  government: "Government", other: "Other",
};

function ApplicationCard({ app, onApprove, onReject, processing }) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState("");
  const s = statusConfig[app.approval_status] || statusConfig.pending;
  const SIcon = s.icon;

  return (
    <div className={`bg-card border rounded-xl overflow-hidden transition-all ${
      app.approval_status === "pending" ? "border-amber-500/30" : "border-border/60"
    }`}>
      <div className="flex items-start justify-between gap-4 p-5">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
            <Building2 className="w-5 h-5 text-blue-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-bold text-foreground">{app.org_name}</p>
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold ${s.bg} ${s.color}`}>
                <SIcon className="w-3 h-3" />{s.label}
              </div>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
              {app.contact_name && <p className="text-sm text-muted-foreground">{app.contact_name}</p>}
              <a href={`mailto:${app.email}`} className="flex items-center gap-1 text-xs text-blue-400 hover:underline">
                <Mail className="w-3 h-3" />{app.email}
              </a>
              {app.phone && <span className="flex items-center gap-1 text-xs text-muted-foreground"><Phone className="w-3 h-3" />{app.phone}</span>}
            </div>
            <div className="flex gap-2 mt-1.5 flex-wrap">
              {app.industry && <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">{industryLabels[app.industry] || app.industry}</span>}
              {app.interest && <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">{app.interest}</span>}
              <span className="text-xs text-muted-foreground">Submitted {format(parseISO(app.created_date), "MMM d, yyyy")}</span>
            </div>
          </div>
        </div>
        <button onClick={() => setExpanded(v => !v)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground shrink-0">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-border/40 px-5 pb-5 pt-4 space-y-4">
          {app.message && (
            <div className="flex gap-2 text-sm text-muted-foreground">
              <MessageSquare className="w-4 h-4 shrink-0 mt-0.5 text-slate-500" />
              <p>"{app.message}"</p>
            </div>
          )}
          {app.approval_status === "pending" && (
            <div className="space-y-3">
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Internal review notes (optional)…"
                rows={2}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring/50"
              />
              <div className="flex gap-2">
                <button
                  disabled={processing}
                  onClick={() => onApprove(app, notes)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-bold rounded-lg transition-all disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve
                </button>
                <button
                  disabled={processing}
                  onClick={() => onReject(app, notes)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-bold rounded-lg transition-all disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </div>
            </div>
          )}
          {app.approval_status !== "pending" && (
            <div className="text-xs text-muted-foreground space-y-1">
              {app.reviewed_by && <p>Reviewed by: <span className="text-foreground">{app.reviewed_by}</span></p>}
              {app.reviewed_at && <p>Reviewed on: <span className="text-foreground">{format(parseISO(app.reviewed_at), "MMM d, yyyy h:mm a")}</span></p>}
              {app.review_notes && <p>Notes: <span className="text-foreground">{app.review_notes}</span></p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ClientApprovals() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [filter, setFilter] = useState("pending");
  const [processing, setProcessing] = useState(false);

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["client_signups"],
    queryFn: () => base44.entities.ClientSignup.list("-created_date", 200),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ClientSignup.update(id, data),
    onSuccess: () => qc.invalidateQueries(["client_signups"]),
  });

  const handleApprove = async (app, notes) => {
    setProcessing(true);
    await updateMut.mutateAsync({
      id: app.id,
      data: {
        approval_status: "approved",
        reviewed_by: user?.email,
        review_notes: notes,
        reviewed_at: new Date().toISOString(),
      },
    });
    // Notify applicant
    await base44.integrations.Core.SendEmail({
      to: app.email,
      from_name: "EDS Sentrix ASM",
      subject: "🎉 Your Application Has Been Approved — EDS Sentrix ASM",
      body: `Hi ${app.contact_name || "there"},\n\nGreat news! Your application for ${app.org_name} has been approved.\n\nOur onboarding team will be in touch within 24 hours to provision your EDS Sentrix ASM dashboard and walk you through the setup.\n\nWelcome aboard!\n\n— The Emerging Defense Solutions Team`,
    });
    toast.success(`${app.org_name} approved. Confirmation email sent.`);
    setProcessing(false);
  };

  const handleReject = async (app, notes) => {
    setProcessing(true);
    await updateMut.mutateAsync({
      id: app.id,
      data: {
        approval_status: "rejected",
        reviewed_by: user?.email,
        review_notes: notes,
        reviewed_at: new Date().toISOString(),
      },
    });
    await base44.integrations.Core.SendEmail({
      to: app.email,
      from_name: "EDS Sentrix ASM",
      subject: "EDS Sentrix ASM — Application Update",
      body: `Hi ${app.contact_name || "there"},\n\nThank you for your interest in EDS Sentrix ASM.\n\nAfter reviewing your application for ${app.org_name}, we're unable to proceed at this time. Our current beta is focused on specific industries and regions in the DMV area.\n\nWe encourage you to check back as we expand availability.\n\nQuestions? Contact us at info@eds-360.com.\n\n— The Emerging Defense Solutions Team`,
    });
    toast.success(`${app.org_name} rejected. Notification email sent.`);
    setProcessing(false);
  };

  const filtered = applications.filter(a => filter === "all" ? true : a.approval_status === filter);
  const pending = applications.filter(a => a.approval_status === "pending").length;

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pending Review", value: applications.filter(a => a.approval_status === "pending").length, color: "text-amber-400" },
          { label: "Approved", value: applications.filter(a => a.approval_status === "approved").length, color: "text-emerald-400" },
          { label: "Rejected", value: applications.filter(a => a.approval_status === "rejected").length, color: "text-red-400" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border/60 rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 border-b border-border/60">
        {[
          { id: "pending", label: `Pending${pending > 0 ? ` (${pending})` : ""}` },
          { id: "approved", label: "Approved" },
          { id: "rejected", label: "Rejected" },
          { id: "all", label: "All" },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              filter === f.id ? "border-tactical-gold text-tactical-gold" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground text-sm">Loading applications…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
          No {filter === "all" ? "" : filter} applications yet.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(app => (
            <ApplicationCard
              key={app.id}
              app={app}
              onApprove={handleApprove}
              onReject={handleReject}
              processing={processing}
            />
          ))}
        </div>
      )}
    </div>
  );
}