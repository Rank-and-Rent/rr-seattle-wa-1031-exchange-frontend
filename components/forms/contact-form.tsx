"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import site from "@/content/site.json";
import { servicesData } from "@/data";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          theme?: "auto" | "light" | "dark";
          size?: "normal" | "compact" | "invisible";
        }
      ) => string;
      reset?: (widgetId?: string) => void;
      remove?: (widgetId?: string) => void;
      execute?: (widgetId?: string) => void;
    };
  }
}

type FieldKey = "name" | "company" | "email" | "phone" | "projectType" | "property" | "estimatedCloseDate" | "city" | "timeline" | "message";
type FormState = Record<FieldKey, string>;
type Status = "idle" | "submitting" | "success" | "error";

const initialFormState: FormState = {
  name: "", company: "", email: "", phone: "", projectType: "",
  property: "", estimatedCloseDate: "", city: "", timeline: "", message: "",
};

const serviceOptions = [
  "Forward Exchange",
  "Reverse Exchange", 
  "Qualified Intermediary Services",
  "Property Identification",
  "NNN Property Identification",
  "Exchange Consultation",
  "Form 8824 Preparation",
  "Boot Analysis",
];

const timelineOptions = ["Immediate", "45 days", "180 days", "Planning phase"];

const TURNSTILE_SCRIPT_ID = "cf-turnstile-script";
const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export interface ContactFormProps {
  source?: string;
  defaultProjectType?: string;
  id?: string;
  onSuccess?: () => void;
  variant?: "light" | "dark";
}

export const ContactForm = ({ source = "Contact form", defaultProjectType = "", id, onSuccess, variant = "light" }: ContactFormProps) => {
  const generatedId = useId();
  const formId = id ?? `contact-form-${generatedId}`;

  const [formState, setFormState] = useState<FormState>({ ...initialFormState, projectType: defaultProjectType });
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const widgetIdRef = useRef<string | undefined>(undefined);
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null);
  const captchaTokenRef = useRef<string | null>(null);
  const captchaPromiseRef = useRef<{ resolve: (t: string) => void; reject: () => void } | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

  // Combine service options with services from data
  const allServices = useMemo(() => {
    const dataServices = servicesData.map((s) => s.name);
    const combined = new Set([...serviceOptions, ...dataServices]);
    return Array.from(combined).sort();
  }, []);

  // Styles based on variant
  const isDark = variant === "dark";
  const styles = {
    label: isDark ? "text-white/80" : "text-[#1F3C58]",
    hint: isDark ? "text-white/50" : "text-[#6b7c8a]",
    input: isDark 
      ? "bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#4DA49B] focus:ring-[#4DA49B]/30" 
      : "bg-white border-[#E2E8F0] text-[#1F3C58] placeholder:text-[#6b7c8a]/60 focus:border-[#4DA49B] focus:ring-[#4DA49B]/30",
    error: isDark ? "text-red-400" : "text-red-500",
    button: isDark 
      ? "bg-[#4DA49B] text-white hover:bg-[#3d8a83]" 
      : "bg-[#1F3C58] text-white hover:bg-[#274f74]",
    message: status === "error" ? (isDark ? "text-red-400" : "text-red-500") : (isDark ? "text-white/80" : "text-[#1F3C58]"),
  };

  useEffect(() => {
    if (!siteKey) return;
    const renderTurnstile = () => {
      if (!window.turnstile || !turnstileContainerRef.current) return;
      const wid = window.turnstile.render(turnstileContainerRef.current, {
        sitekey: siteKey, size: "normal",
        callback: (token: string) => {
          captchaTokenRef.current = token;
          setCaptchaToken(token);
          setStatus((p) => (p === "error" ? "idle" : p));
          setStatusMessage("");
          captchaPromiseRef.current?.resolve(token);
          captchaPromiseRef.current = null;
        },
        "error-callback": () => {
          captchaTokenRef.current = null;
          setCaptchaToken(null);
          setStatus("error");
          setStatusMessage("CAPTCHA failed. Please reload and try again.");
          captchaPromiseRef.current?.reject();
          captchaPromiseRef.current = null;
        },
        "expired-callback": () => {
          captchaTokenRef.current = null;
          setCaptchaToken(null);
          if (widgetIdRef.current && window.turnstile?.reset) window.turnstile.reset(widgetIdRef.current);
        },
      });
      widgetIdRef.current = wid;
    };
    const existing = document.getElementById(TURNSTILE_SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      if (window.turnstile) renderTurnstile();
      else existing.addEventListener("load", renderTurnstile, { once: true });
    } else {
      const script = document.createElement("script");
      script.id = TURNSTILE_SCRIPT_ID;
      script.src = TURNSTILE_SRC;
      script.async = true;
      script.defer = true;
      script.onload = renderTurnstile;
      document.head.appendChild(script);
    }
    return () => { if (widgetIdRef.current && window.turnstile?.remove) window.turnstile.remove(widgetIdRef.current); };
  }, [siteKey]);

  useEffect(() => {
    if (status === "success") setStatusMessage("Thank you. A Seattle exchange specialist will follow up within one business day.");
    else if (status === "error" && !statusMessage) setStatusMessage(`Submission failed. Please call ${site.phone}.`);
  }, [status, statusMessage]);

  const validate = useCallback((s: FormState) => {
    const e: Partial<Record<FieldKey, string>> = {};
    if (!s.name.trim()) e.name = "Name is required.";
    if (!s.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email.trim())) e.email = "Please enter a valid email.";
    if (!s.phone.trim()) e.phone = "Phone is required.";
    if (!s.projectType.trim()) e.projectType = "Please select a service.";
    return e;
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = validate(formState);
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    if (!captchaTokenRef.current && widgetIdRef.current && window.turnstile?.execute) {
      try {
        const p = new Promise<string>((res, rej) => {
          captchaPromiseRef.current = { resolve: res, reject: rej };
          window.turnstile?.execute?.(widgetIdRef.current);
        });
        const token = await Promise.race([p, new Promise<string>((_, r) => setTimeout(() => r(new Error("Timeout")), 10000))]);
        captchaTokenRef.current = token;
        setCaptchaToken(token);
      } catch {
        setStatus("error");
        setStatusMessage("Verification timed out. Please try again.");
        captchaPromiseRef.current = null;
        return;
      }
    }
    if (!captchaTokenRef.current) { setStatus("error"); setStatusMessage("Please complete the security verification."); return; }

    setStatus("submitting");
    setStatusMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...formState, 
          source, 
          turnstileToken: captchaTokenRef.current,
          details: formState.message, // Also send as details for API compatibility
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setFormState({ ...initialFormState, projectType: defaultProjectType || "" });
      setErrors({});
      captchaTokenRef.current = null;
      setCaptchaToken(null);
      onSuccess?.();
      if (widgetIdRef.current && window.turnstile?.reset) window.turnstile.reset(widgetIdRef.current);
    } catch {
      setStatus("error");
      setStatusMessage(`Submission failed. Please call ${site.phone}.`);
      if (widgetIdRef.current && window.turnstile?.reset) window.turnstile.reset(widgetIdRef.current);
    }
  };

  const onChange = (f: FieldKey) => (v: string) => {
    setFormState((p) => ({ ...p, [f]: v }));
    setErrors((p) => { if (!p[f]) return p; const n = { ...p }; delete n[f]; return n; });
  };

  const isDisabled = status === "submitting" || !captchaToken || !siteKey;

  if (status === "success") {
    return (
      <div className={`rounded-2xl border p-8 text-center ${isDark ? "border-white/20 bg-white/10" : "border-[#E2E8F0] bg-white"}`}>
        <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${isDark ? "bg-[#4DA49B]/20" : "bg-[#4DA49B]/10"}`}>
          <svg className="h-8 w-8 text-[#4DA49B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className={`text-2xl font-semibold ${isDark ? "text-white" : "text-[#1F3C58]"}`}>Thank You!</h3>
        <p className={`mt-4 ${isDark ? "text-white/70" : "text-[#6b7c8a]"}`}>
          We've received your inquiry and will contact you within one business day.
        </p>
      </div>
    );
  }

  return (
    <form id={formId} className="space-y-6" noValidate onSubmit={handleSubmit}>
      <h2 className={`text-xl font-semibold ${styles.label}`}>Start Your Exchange Plan</h2>
      
      {/* Name */}
      <div className="space-y-2">
        <label htmlFor={`${formId}-name`} className={`block text-sm font-medium ${styles.label}`}>
          Name <span className="text-[#4DA49B]">*</span>
        </label>
        <input
          id={`${formId}-name`}
          type="text"
          value={formState.name}
          onChange={(e) => onChange("name")(e.target.value)}
          placeholder="Primary investor or advisor name"
          className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 ${styles.input}`}
          required
        />
        {errors.name && <span className={`text-xs ${styles.error}`}>{errors.name}</span>}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label htmlFor={`${formId}-email`} className={`block text-sm font-medium ${styles.label}`}>
          Email <span className="text-[#4DA49B]">*</span>
        </label>
        <input
          id={`${formId}-email`}
          type="email"
          value={formState.email}
          onChange={(e) => onChange("email")(e.target.value)}
          placeholder="We send a confirmation and documentation checklist"
          className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 ${styles.input}`}
          required
        />
        {errors.email && <span className={`text-xs ${styles.error}`}>{errors.email}</span>}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <label htmlFor={`${formId}-phone`} className={`block text-sm font-medium ${styles.label}`}>
          Phone <span className="text-[#4DA49B]">*</span>
        </label>
        <input
          id={`${formId}-phone`}
          type="tel"
          value={formState.phone}
          onChange={(e) => onChange("phone")(e.target.value)}
          placeholder="We confirm timelines by phone within one business day"
          className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 ${styles.input}`}
          required
        />
        {errors.phone && <span className={`text-xs ${styles.error}`}>{errors.phone}</span>}
      </div>

      {/* Company */}
      <div className="space-y-2">
        <label htmlFor={`${formId}-company`} className={`block text-sm font-medium ${styles.label}`}>
          Company
        </label>
        <input
          id={`${formId}-company`}
          type="text"
          value={formState.company}
          onChange={(e) => onChange("company")(e.target.value)}
          placeholder="Company or organization name (optional)"
          className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 ${styles.input}`}
        />
      </div>

      {/* Service */}
      <div className="space-y-2">
        <label htmlFor={`${formId}-service`} className={`block text-sm font-medium ${styles.label}`}>
          Service <span className="text-[#4DA49B]">*</span>
        </label>
        <select
          id={`${formId}-service`}
          value={formState.projectType}
          onChange={(e) => onChange("projectType")(e.target.value)}
          className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 ${styles.input}`}
          required
        >
          <option value="">Select the service you are interested in</option>
          {allServices.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {errors.projectType && <span className={`text-xs ${styles.error}`}>{errors.projectType}</span>}
      </div>

      {/* City */}
      <div className="space-y-2">
        <label htmlFor={`${formId}-city`} className={`block text-sm font-medium ${styles.label}`}>
          City
        </label>
        <input
          id={`${formId}-city`}
          type="text"
          value={formState.city}
          onChange={(e) => onChange("city")(e.target.value)}
          placeholder="Primary metro or submarket (optional)"
          className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 ${styles.input}`}
        />
      </div>

      {/* Timeline */}
      <div className="space-y-2">
        <label htmlFor={`${formId}-timeline`} className={`block text-sm font-medium ${styles.label}`}>
          Timeline
        </label>
        <select
          id={`${formId}-timeline`}
          value={formState.timeline}
          onChange={(e) => onChange("timeline")(e.target.value)}
          className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 ${styles.input}`}
        >
          <option value="">Select timeline (optional)</option>
          {timelineOptions.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <p className={`text-xs ${styles.hint}`}>When do you plan to start your exchange?</p>
      </div>

      {/* Property Being Sold */}
      <div className="space-y-2">
        <label htmlFor={`${formId}-property`} className={`block text-sm font-medium ${styles.label}`}>
          Property Being Sold
        </label>
        <input
          id={`${formId}-property`}
          type="text"
          value={formState.property}
          onChange={(e) => onChange("property")(e.target.value)}
          placeholder="Include property type, location, and estimated value (optional)"
          className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 ${styles.input}`}
        />
      </div>

      {/* Estimated Close Date */}
      <div className="space-y-2">
        <label htmlFor={`${formId}-closeDate`} className={`block text-sm font-medium ${styles.label}`}>
          Estimated Close Date
        </label>
        <input
          id={`${formId}-closeDate`}
          type="date"
          value={formState.estimatedCloseDate}
          onChange={(e) => onChange("estimatedCloseDate")(e.target.value)}
          className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 ${styles.input}`}
        />
        <p className={`text-xs ${styles.hint}`}>Determines your 45 day and 180 day milestones (optional)</p>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <label htmlFor={`${formId}-message`} className={`block text-sm font-medium ${styles.label}`}>
          Message
        </label>
        <textarea
          id={`${formId}-message`}
          value={formState.message}
          onChange={(e) => onChange("message")(e.target.value)}
          placeholder="Outline goals, replacement preferences, or coordination needs (optional)"
          rows={4}
          className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 ${styles.input}`}
        />
      </div>

      {/* Turnstile */}
      <div ref={turnstileContainerRef} className="flex justify-center" />
      {!siteKey && <p className={`text-sm ${styles.error}`}>CAPTCHA unavailable. Please contact us directly.</p>}

      {/* Submit */}
      <button
        type="submit"
        disabled={isDisabled}
        className={`w-full rounded-lg py-4 text-sm font-semibold uppercase tracking-wider transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${styles.button}`}
      >
        {status === "submitting" ? "Submitting..." : "Submit Request"}
      </button>

      {statusMessage && <p className={`text-sm ${styles.message}`}>{statusMessage}</p>}
      
      <p className={`text-xs ${styles.hint}`}>
        Consult your QI, CPA, and legal counsel before executing exchange strategies.
      </p>
    </form>
  );
};

export default ContactForm;
