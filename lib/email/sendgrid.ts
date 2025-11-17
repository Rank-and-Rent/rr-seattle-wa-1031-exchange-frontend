import sgMail from "@sendgrid/mail";
import { COMPANY_NAME, EMAIL } from "@/lib/config";

let apiKeyInitialized = false;

function ensureApiKeyInitialized() {
  if (apiKeyInitialized) {
    return;
  }
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    throw new Error("Missing SENDGRID_API_KEY");
  }
  sgMail.setApiKey(apiKey);
  apiKeyInitialized = true;
}

export const SENDGRID_TEMPLATE_ID =
  process.env.SENDGRID_TEMPLATE_ID || "d-15217ab1c55347b5847c2421b1a82847";

type Lead = {
  name: string;
  email: string;
  phone?: string;
  phone_plain?: string;
  projectType: string;
  projectDescription?: string;
  timeline?: string;
  address?: string;
  city?: string;
};

type BrandData = Record<string, unknown>;

const defaultFromEmail =
  process.env.LEAD_SENDER_EMAIL || process.env.CONTRACTOR_EMAIL || EMAIL;

export async function sendCustomerConfirmation(brand: BrandData, lead: Lead) {
  ensureApiKeyInitialized();
  const msg = {
    to: lead.email,
    from: { email: defaultFromEmail, name: COMPANY_NAME },
    templateId: SENDGRID_TEMPLATE_ID,
    dynamicTemplateData: { ...brand, lead },
  };
  await sgMail.send(msg);
}

export async function sendInternalNotifications(
  brand: BrandData,
  lead: Lead
) {
  ensureApiKeyInitialized();
  const recipients = [
    process.env.CONTRACTOR_EMAIL,
    process.env.LEAD_RECIPIENT_EMAIL,
    "rankhoundseo@gmail.com",
  ]
    .map((email) => email?.trim())
    .filter(Boolean) as string[];

  const payload = { ...brand, lead };

  await Promise.all(
    recipients.map((email) =>
      sgMail.send({
        to: email,
        from: { email: defaultFromEmail, name: COMPANY_NAME },
        templateId: SENDGRID_TEMPLATE_ID,
        dynamicTemplateData: payload,
      })
    )
  );
}

