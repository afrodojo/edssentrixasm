import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { org_name, contact_name, email, phone, industry, interest, message } = body;

    if (!org_name || !email) {
      return Response.json({ error: 'Organization name and email are required.' }, { status: 400 });
    }

    // Save application to DB
    const record = await base44.asServiceRole.entities.ClientSignup.create({
      org_name, contact_name, email, phone, industry, interest, message,
      approval_status: 'pending',
    });

    // Notify admin
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: 'admin@eds-360.com',
      subject: `[EDS Sentrix ASM] New Client Application — ${org_name}`,
      body: `A new client application requires your review.\n\n` +
        `Organization: ${org_name}\n` +
        `Contact: ${contact_name || 'N/A'}\n` +
        `Email: ${email}\n` +
        `Phone: ${phone || 'N/A'}\n` +
        `Industry: ${(industry || '').replace(/_/g, ' ')}\n` +
        `Interested in: ${interest || 'N/A'}\n` +
        `Message: ${message || 'None'}\n\n` +
        `Review this application in the Admin Control Center:\n` +
        `https://asm.emergingdefensesolutions.com/app/admin\n\n` +
        `Application ID: ${record.id}`,
    });

    // Auto-confirm email to applicant
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: email,
      from_name: 'EDS Sentrix ASM',
      subject: 'Application Received — EDS Sentrix ASM',
      body: `Hi ${contact_name || 'there'},\n\n` +
        `Thank you for applying to the EDS Sentrix ASM beta program.\n\n` +
        `Your application for ${org_name} has been received and is currently under review. ` +
        `Our team will verify your information and respond within 24–48 hours.\n\n` +
        `What happens next:\n` +
        `1. Our team reviews your application\n` +
        `2. You'll receive an approval email with onboarding instructions\n` +
        `3. Access to your EDS Sentrix ASM dashboard is provisioned\n\n` +
        `Questions? Reply to this email or contact us at info@eds-360.com.\n\n` +
        `— The Emerging Defense Solutions Team`,
    });

    return Response.json({ success: true, id: record.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});