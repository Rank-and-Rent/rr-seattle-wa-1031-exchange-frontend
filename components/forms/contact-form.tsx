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

  // Styles - Seattle design system
  const isDark = variant === "dark";
  const inputBase = "w-full border-b bg-transparent py-3 text-sm focus:outline-none transition-colors";
  const labelBase = "block text-xs tracking-[0.2em] uppercase mb-2";
  
  const styles = {
    label: isDark ? "text-white/70" : "text-[#6b7c8a]",
    hint: isDark ? "text-white/50" : "text-[#6b7c8a]/70",
    input: isDark 
      ? `${inputBase} border-white/20 text-white placeholder:text-white/40 focus:border-[#b8a074]`
      : `${inputBase} border-gray-300 text-[#2c3e50] placeholder:text-[#6b7c8a]/60 focus:border-[#b8a074]`,
    select: isDark
      ? `${inputBase} border-white/20 text-white bg-transparent focus:border-[#b8a074]`
      : `${inputBase} border-gray-300 text-[#2c3e50] bg-[#f7f6f4] focus:border-[#b8a074]`,
    error: isDark ? "text-red-400" : "text-red-500",
    button: isDark
      ? "bg-[#b8a074] text-white hover:bg-[#a08960]"
      : "bg-[#2c3e50] text-white hover:bg-[#1a3a52]",
    message: status === "error" ? (isDark ? "text-red-400" : "text-red-500") : (isDark ? "text-white/80" : "text-[#6b7c8a]"),
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
          details: formState.message,
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

  return (
    <form id={formId} className="space-y-5" noValidate onSubmit={handleSubmit}>
      {/* Row 1: Name + Email */}
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor={`${formId}-name`} className={`${labelBase} ${styles.label}`}>
            Name <span className="text-[#b8a074]">*</span>
          </label>
          <input
            id={`${formId}-name`}
            type="text"
            value={formState.name}
            onChange={(e) => onChange("name")(e.target.value)}
            placeholder="Primary investor or advisor name"
            className={styles.input}
            required
          />
          {errors.name && <span className={`text-xs mt-1 block ${styles.error}`}>{errors.name}</span>}
        </div>
        <div>
          <label htmlFor={`${formId}-email`} className={`${labelBase} ${styles.label}`}>
            Email <span className="text-[#b8a074]">*</span>
          </label>
          <input
            id={`${formId}-email`}
            type="email"
            value={formState.email}
            onChange={(e) => onChange("email")(e.target.value)}
            placeholder="We send a confirmation and checklist"
            className={styles.input}
            required
          />
          {errors.email && <span className={`text-xs mt-1 block ${styles.error}`}>{errors.email}</span>}
        </div>
      </div>

      {/* Row 2: Phone + Company */}
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor={`${formId}-phone`} className={`${labelBase} ${styles.label}`}>
            Phone <span className="text-[#b8a074]">*</span>
          </label>
          <input
            id={`${formId}-phone`}
            type="tel"
            value={formState.phone}
            onChange={(e) => onChange("phone")(e.target.value)}
            placeholder="We confirm timelines within one business day"
            className={styles.input}
            required
          />
          {errors.phone && <span className={`text-xs mt-1 block ${styles.error}`}>{errors.phone}</span>}
        </div>
        <div>
          <label htmlFor={`${formId}-company`} className={`${labelBase} ${styles.label}`}>
            Company
          </label>
          <input
            id={`${formId}-company`}
            type="text"
            value={formState.company}
            onChange={(e) => onChange("company")(e.target.value)}
            placeholder="Company or organization (optional)"
            className={styles.input}
          />
        </div>
      </div>

      {/* Service */}
      <div>
        <label htmlFor={`${formId}-service`} className={`${labelBase} ${styles.label}`}>
          Service <span className="text-[#b8a074]">*</span>
        </label>
        <select
          id={`${formId}-service`}
          value={formState.projectType}
          onChange={(e) => onChange("projectType")(e.target.value)}
          className={styles.select}
          required
        >
          <option value="">Select the service you are interested in</option>
          {allServices.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {errors.projectType && <span className={`text-xs mt-1 block ${styles.error}`}>{errors.projectType}</span>}
      </div>

      {/* Row 3: City + Timeline */}
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor={`${formId}-city`} className={`${labelBase} ${styles.label}`}>
            City
          </label>
          <input
            id={`${formId}-city`}
            type="text"
            value={formState.city}
            onChange={(e) => onChange("city")(e.target.value)}
            placeholder="Primary metro or submarket (optional)"
            className={styles.input}
          />
        </div>
        <div>
          <label htmlFor={`${formId}-timeline`} className={`${labelBase} ${styles.label}`}>
            Timeline
          </label>
          <select
            id={`${formId}-timeline`}
            value={formState.timeline}
            onChange={(e) => onChange("timeline")(e.target.value)}
            className={styles.select}
          >
            <option value="">Select timeline (optional)</option>
            {timelineOptions.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Property Being Sold */}
      <div>
        <label htmlFor={`${formId}-property`} className={`${labelBase} ${styles.label}`}>
          Property Being Sold
        </label>
        <input
          id={`${formId}-property`}
          type="text"
          value={formState.property}
          onChange={(e) => onChange("property")(e.target.value)}
          placeholder="Property type, location, and estimated value (optional)"
          className={styles.input}
        />
      </div>

      {/* Estimated Close Date */}
      <div>
        <label htmlFor={`${formId}-closeDate`} className={`${labelBase} ${styles.label}`}>
          Estimated Close Date
        </label>
        <input
          id={`${formId}-closeDate`}
          type="date"
          value={formState.estimatedCloseDate}
          onChange={(e) => onChange("estimatedCloseDate")(e.target.value)}
          className={styles.input}
        />
        <p className={`text-xs mt-1 ${styles.hint}`}>Determines your 45 day and 180 day milestones (optional)</p>
      </div>

      {/* Message */}
      <div>
        <label htmlFor={`${formId}-message`} className={`${labelBase} ${styles.label}`}>
          Message
        </label>
        <textarea
          id={`${formId}-message`}
          value={formState.message}
          onChange={(e) => onChange("message")(e.target.value)}
          placeholder="Outline goals, replacement preferences, or coordination needs (optional)"
          rows={4}
          className={`${styles.input} resize-none`}
        />
      </div>

      {/* Turnstile */}
      <div ref={turnstileContainerRef} className="flex justify-start" />
      {!siteKey && <p className={`text-sm ${styles.error}`}>CAPTCHA unavailable. Please contact us directly.</p>}

      {/* Submit */}
      <button
        type="submit"
        disabled={isDisabled}
        className={`w-full py-4 text-xs tracking-[0.2em] uppercase font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${styles.button}`}
      >
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>

      {statusMessage && <p className={`text-sm ${styles.message}`}>{statusMessage}</p>}

      <p className={`text-xs ${styles.hint}`}>
        Consult your QI, CPA, and legal counsel before executing exchange strategies.
      </p>
    </form>
  );
};

export default ContactForm;
