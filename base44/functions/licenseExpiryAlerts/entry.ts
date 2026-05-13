import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Allow scheduled/service calls without user auth
    const licenses = await base44.asServiceRole.entities.License.list('-valid_until', 500);
    const orgs = await base44.asServiceRole.entities.Organization.list('-created_date', 200);

    const orgMap = {};
    for (const org of orgs) orgMap[org.id] = org;

    const now = new Date();
    const expiring = licenses.filter(l => {
      if (l.status !== 'active' || !l.valid_until) return false;
      const daysLeft = Math.ceil((new Date(l.valid_until) - now) / (1000 * 60 * 60 * 24));
      return daysLeft > 0 && daysLeft <= 30;
    }).map(l => {
      const daysLeft = Math.ceil((new Date(l.valid_until) - now) / (1000 * 60 * 60 * 24));
      return { ...l, daysLeft };
    }).sort((a, b) => a.daysLeft - b.daysLeft);

    if (expiring.length === 0) {
      return Response.json({ sent: false, message: 'No licenses expiring within 30 days.' });
    }

    const productLabels = {
      sentrix_asm: 'Sentrix ASM', compliance_lms: 'Compliance LMS',
      dispatch_module: 'Dispatch', aerial_ops: 'Aerial Ops',
      ep_module: 'Executive Protection', pro_shop: 'Pro Shop', socaas: 'SOCaaS',
    };

    const rows = expiring.map(l =>
      `  • ${l.organization_name || l.organization_id} — ${productLabels[l.product] || l.product} | ` +
      `Expires: ${l.valid_until} (${l.daysLeft} day${l.daysLeft === 1 ? '' : 's'} left) | ` +
      `Seats: ${l.seats_used ?? 0}/${l.seats_licensed ?? 1}`
    ).join('\n');

    const urgentCount = expiring.filter(l => l.daysLeft <= 7).length;
    const subject = urgentCount > 0
      ? `🚨 URGENT: ${urgentCount} License(s) Expiring Within 7 Days — EDS Sentrix ASM`
      : `⚠️ ${expiring.length} License(s) Expiring Within 30 Days — EDS Sentrix ASM`;

    const body = [
      `License Expiry Alert — EDS Sentrix ASM`,
      `Generated: ${now.toLocaleString('en-US', { timeZone: 'America/New_York' })} EST`,
      ``,
      `The following active licenses are expiring within the next 30 days:`,
      ``,
      rows,
      ``,
      `─────────────────────────────────────────────`,
      `Summary:`,
      `  Total expiring in 30 days : ${expiring.length}`,
      `  Expiring in ≤ 7 days      : ${urgentCount}`,
      ``,
      `Action Required:`,
      `  Review and renew these licenses in the Admin Control Center:`,
      `  https://asm.emergingdefensesolutions.com/app/admin`,
      ``,
      `— EDS Sentrix ASM Automated Alert System`,
    ].join('\n');

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: 'admin@eds-360.com',
      from_name: 'EDS Sentrix ASM Alerts',
      subject,
      body,
    });

    return Response.json({ sent: true, count: expiring.length, urgent: urgentCount });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});