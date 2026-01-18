"use client";

import {
  ChangeEvent,
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

type FieldKey = "name" | "company" | "email" | "phone" | "projectType" | "property" | "estimatedCloseDate" | "city" | "timeline" | "details";
type FormState = Record<FieldKey, string>;
type Status = "idle" | "submitting" | "success" | "error";

const initialFormState: FormState = {
  name: "", company: "", email: "", phone: "", projectType: "",
  property: "", estimatedCloseDate: "", city: "", timeline: "", details: "",
};

const timelineOptions = ["Immediate", "45 days", "180 days", "Planning phase"];
const TURNSTILE_SCRIPT_ID = "cf-turnstile-script";
const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=invisible";

export interface ContactFormProps {
  source: string;
  defaultProjectType?: string;
  id?: string;
  onSuccess?: () => void;
  variant?: "light" | "dark";
}

export const ContactForm = ({ source, defaultProjectType = "", id, onSuccess, variant = "light" }: ContactFormProps) => {
  const generatedId = useId();
  const formId = id ?? `contact-form-${generatedId}`;
  const datalistId = `${formId}-project-types`;

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

  const projectTypeOptions = useMemo(() => servicesData.map((s) => s.name), []);

  // Styles based on variant
  const styles = variant === "dark" ? {
    label: "text-white/70",
    input: "bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#b8a074]",
    error: "text-red-400",
    button: "bg-[#b8a074] text-white hover:bg-[#a08960]",
    message: status === "error" ? "text-red-400" : "text-white/80",
    hint: "text-white/50",
    required: "text-[#b8a074]",
  } : {
    label: "text-[#6b7c8a]",
    input: "bg-[#f7f6f4] border-gray-200 text-[#2c3e50] placeholder:text-[#6b7c8a]/60 focus:border-[#b8a074]",
    error: "text-red-500",
    button: "bg-[#2c3e50] text-white hover:bg-[#1a3a52]",
    message: status === "error" ? "text-red-500" : "text-[#6b7c8a]",
    hint: "text-[#6b7c8a]/70",
    required: "text-[#b8a074]",
  };

  useEffect(() => {
    if (!siteKey) return;
    const renderTurnstile = () => {
      if (!window.turnstile || !turnstileContainerRef.current) return;
      const wid = window.turnstile.render(turnstileContainerRef.current, {
        sitekey: siteKey, size: "invisible",
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
    if (status === "success") setStatusMessage("Thank you. We will contact you within one business day.");
    else if (status === "error" && !statusMessage) setStatusMessage(`Submission failed. Please call ${site.phone}.`);
  }, [status, statusMessage]);

  const validate = useCallback((s: FormState) => {
    const e: Partial<Record<FieldKey, string>> = {};
    if (!s.name.trim()) e.name = "Name required.";
    if (!s.email.trim()) e.email = "Email required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email.trim())) e.email = "Invalid email.";
    if (!s.phone.trim()) e.phone = "Phone required.";
    if (!s.projectType.trim()) e.projectType = "Project type required.";
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
        setStatusMessage("Verification timed out.");
        captchaPromiseRef.current = null;
        return;
      }
    }
    if (!captchaTokenRef.current) { setStatus("error"); setStatusMessage("Please complete verification."); return; }

    setStatus("submitting");
    setStatusMessage("");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formState, source, "cf-turnstile-response": captchaTokenRef.current }),
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
      <div className="grid gap-4 md:grid-cols-2">
        <Field id={`${formId}-name`} label="Name" required value={formState.name} error={errors.name} onChange={onChange("name")} styles={styles} />
        <Field id={`${formId}-email`} label="Email" type="email" required value={formState.email} error={errors.email} onChange={onChange("email")} styles={styles} />
        <Field id={`${formId}-phone`} label="Phone" type="tel" required value={formState.phone} error={errors.phone} onChange={onChange("phone")} styles={styles} />
        <Field id={`${formId}-project`} label="Project Type" required value={formState.projectType} error={errors.projectType} onChange={onChange("projectType")} list={datalistId} placeholder="e.g. NNN property acquisition" styles={styles} />
      </div>
      <Field id={`${formId}-details`} label="Details (optional)" value={formState.details} onChange={onChange("details")} placeholder="Share cap rate targets, timelines, or specific requirements." textarea styles={styles} />
      <datalist id={datalistId}>{projectTypeOptions.map((o) => <option key={o} value={o} />)}</datalist>
      <div ref={turnstileContainerRef} className="hidden" />
      {!siteKey && <p className={`text-sm ${styles.error}`}>CAPTCHA unavailable.</p>}
      <button
        type="submit"
        disabled={isDisabled}
        className={`w-full py-4 text-xs tracking-[0.2em] uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${styles.button}`}
      >
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>
      {statusMessage && <p className={`text-sm ${styles.message}`}>{statusMessage}</p>}
      <p className={`text-xs ${styles.hint}`}>Consult your QI, CPA, and legal counsel before executing exchange strategies.</p>
    </form>
  );
};

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
  list?: string;
  textarea?: boolean;
  styles: {
    label: string;
    input: string;
    error: string;
    required: string;
  };
}

const Field = ({ id, label, value, onChange, type = "text", required, error, placeholder, list, textarea, styles }: FieldProps) => (
  <div className="space-y-2">
    <label htmlFor={id} className={`block text-xs tracking-[0.15em] uppercase ${styles.label}`}>
      {label}{required && <span className={`${styles.required} ml-1`}>*</span>}
    </label>
    {textarea ? (
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className={`w-full px-4 py-3 border text-sm focus:outline-none ${styles.input}`}
      />
    ) : (
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        list={list}
        className={`w-full px-4 py-3 border text-sm focus:outline-none ${error ? "border-red-400" : styles.input}`}
      />
    )}
    {error && <span className={`text-xs ${styles.error}`}>{error}</span>}
  </div>
);

export default ContactForm;
