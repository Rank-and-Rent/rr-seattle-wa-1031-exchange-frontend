import { NextRequest, NextResponse } from "next/server";
import { apiRateLimiter } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { getBrand } from "@/lib/brand";
import {
  COMPANY_NAME,
  PHONE,
  PHONE_DIGITS,
  SOURCE_LABEL,
} from "@/lib/config";
import {
  sendCustomerConfirmation,
  sendInternalNotifications,
} from "@/lib/email/sendgrid";

export const runtime = "nodejs";

const SITE_IDENTIFIER = "rr-seattle-wa-1031-exchange";

function mapProjectType(): string {
  return "1031 Exchange";
}

export async function POST(request: NextRequest) {
  const rate = apiRateLimiter.isAllowed(request);
  const baseHeaders = {
    "X-RateLimit-Limit": "5",
    "X-RateLimit-Remaining": rate.remaining.toString(),
    "X-RateLimit-Reset": rate.resetTime.toString(),
  };

  if (!rate.allowed) {
    const retryAfter = Math.ceil((rate.resetTime - Date.now()) / 1000);
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later.", retryAfter },
      { status: 429, headers: { ...baseHeaders, "Retry-After": `${retryAfter}` } }
    );
  }

  try {
    const contentType = request.headers.get("content-type") || "";
    const body = contentType.includes("application/json")
      ? await request.json()
      : Object.fromEntries((await request.formData()).entries());

    const zapierWebhookUrl = (process.env.ZAPIER_WEBHOOK || "").trim();
    if (!zapierWebhookUrl) {
      console.error("ZAPIER_WEBHOOK environment variable is not set");
      return NextResponse.json(
        { error: "Webhook configuration error" },
        { status: 500, headers: baseHeaders }
      );
    }

    // Accept both token formats like LA does
    const token = body["cf-turnstile-response"] || body["turnstileToken"];
    if (!token) {
      console.error("Missing captcha token in request");
      return NextResponse.json(
        { error: "Captcha token missing" },
        { status: 400, headers: baseHeaders }
      );
    }

    const clientIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      undefined;

    const captchaValid = await verifyTurnstile(token, clientIp);
    if (!captchaValid) {
      console.error("Captcha verification failed");
      return NextResponse.json(
        { error: "Captcha verification failed" },
        { status: 400, headers: baseHeaders }
      );
    }

    const payload = {
      ...body,
      projectType: mapProjectType(),
      contractorEmail: process.env.CONTRACTOR_EMAIL || "",
      timestamp: new Date().toISOString(),
      source: SOURCE_LABEL,
      submitted_at: new Date().toISOString(),
      website_url:
        process.env.NEXT_PUBLIC_SITE_URL ||
        "https://www.1031exchangeseattle.com",
      _meta: {
        site: SITE_IDENTIFIER,
        route: "/api/contact",
      },
    };

    const zapierUrl = zapierWebhookUrl.endsWith("/")
      ? zapierWebhookUrl
      : `${zapierWebhookUrl}/`;

    let webhookResponse: Response | undefined;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20_000);
      try {
        webhookResponse = await fetch(zapierUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
      } catch (error) {
        console.error("Zapier fetch error", { attempt, error });
      } finally {
        clearTimeout(timeout);
      }
      if (webhookResponse?.ok) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, attempt * 250));
    }

    if (!webhookResponse || !webhookResponse.ok) {
      const status = webhookResponse?.status;
      const text = webhookResponse
        ? await webhookResponse.text().catch(() => "")
        : "";
      console.error("Zapier webhook failed after retries (will continue)", { status, text });
      // Do not block UX; continue to email even if Zapier fails
    }

    const brand = getBrand();
    const lead = {
      name: String(body.name || ""),
      email: String(body.email || ""),
      phone: body.phone ? String(body.phone) : undefined,
      phone_plain: body.phone ? String(body.phone).replace(/\D/g, "") : undefined,
      projectType: String(body.projectType || body.service || "1031 Exchange Project"),
      property: body.property ? String(body.property) : undefined,
      estimatedCloseDate: body.estimatedCloseDate ? String(body.estimatedCloseDate) : undefined,
      city: body.city ? String(body.city) : undefined,
      company: body.company ? String(body.company) : undefined,
      timeline: body.timeline ? String(body.timeline) : undefined,
      message: body.message ? String(body.message) : (body.details ? String(body.details) : undefined),
      source: body.source ? String(body.source) : SOURCE_LABEL,
    };

    const brandWithDate = {
      ...brand,
      COMPANY_NAME,
      PHONE,
      PHONE_DIGITS,
      submitted_date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    try {
      await Promise.all([
        sendCustomerConfirmation(brandWithDate, lead),
        sendInternalNotifications(brandWithDate, lead),
      ]);
      console.log("SendGrid emails sent successfully to:", body.email);
    } catch (error) {
      console.error("SendGrid email failed", error);
      // continue without blocking UX
    }

    return NextResponse.json({ success: true }, { headers: baseHeaders });
  } catch (error) {
    console.error("Error processing form submission", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: baseHeaders }
    );
  }
}
