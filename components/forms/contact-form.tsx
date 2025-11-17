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

type FieldKey =
  | "name"
  | "company"
  | "email"
  | "phone"
  | "projectType"
  | "timeline"
  | "details";

type FormState = Record<FieldKey, string>;

type Status = "idle" | "submitting" | "success" | "error";

const initialFormState: FormState = {
  name: "",
  company: "",
  email: "",
  phone: "",
  projectType: "",
  timeline: "",
  details: "",
};

const timelineOptions = [
  "Immediate",
  "45 days",
  "180 days",
  "Planning phase",
];

const TURNSTILE_SCRIPT_ID = "cf-turnstile-script";
const TURNSTILE_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=invisible";

export interface ContactFormProps {
  source: string;
  defaultProjectType?: string;
  id?: string;
  onSuccess?: () => void;
}

export const ContactForm = ({
  source,
  defaultProjectType = "",
  id,
  onSuccess,
}: ContactFormProps) => {
  const generatedId = useId();
  const formId = id ?? `contact-form-${generatedId}`;
  const datalistId = `${formId}-project-types`;
  const statusId = `${formId}-status`;

  const [formState, setFormState] = useState<FormState>({
    ...initialFormState,
    projectType: defaultProjectType,
  });
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const widgetIdRef = useRef<string | undefined>(undefined);
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null);
  const captchaTokenRef = useRef<string | null>(null);
  const captchaPromiseRef = useRef<{
    resolve: (token: string) => void;
    reject: () => void;
  } | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

  const projectTypeOptions = useMemo(
    () => servicesData.map((service) => service.name),
    []
  );

  useEffect(() => {
    if (!siteKey) {
      console.warn(
        "Cloudflare Turnstile site key missing. Set NEXT_PUBLIC_TURNSTILE_SITE_KEY."
      );
      return;
    }

    const renderTurnstile = () => {
      if (!window.turnstile || !turnstileContainerRef.current) {
        return;
      }
      const widgetId = window.turnstile.render(turnstileContainerRef.current, {
        sitekey: siteKey,
        size: "invisible",
        callback: (token: string) => {
          captchaTokenRef.current = token;
          setCaptchaToken(token);
          setStatus((prev) => (prev === "error" ? "idle" : prev));
          setStatusMessage("");
          if (captchaPromiseRef.current) {
            captchaPromiseRef.current.resolve(token);
            captchaPromiseRef.current = null;
          }
        },
        "error-callback": () => {
          captchaTokenRef.current = null;
          setCaptchaToken(null);
          setStatus("error");
          setStatusMessage(
            "We could not verify the CAPTCHA. Please reload the page and try again."
          );
          if (captchaPromiseRef.current) {
            captchaPromiseRef.current.reject();
            captchaPromiseRef.current = null;
          }
        },
        "expired-callback": () => {
          captchaTokenRef.current = null;
          setCaptchaToken(null);
          if (widgetIdRef.current && window.turnstile?.reset) {
            window.turnstile.reset(widgetIdRef.current);
          }
        },
      });
      widgetIdRef.current = widgetId;
    };

    const ensureScript = () => {
      const existing = document.getElementById(
        TURNSTILE_SCRIPT_ID
      ) as HTMLScriptElement | null;
      if (existing) {
        if (window.turnstile) {
          renderTurnstile();
        } else {
          existing.addEventListener("load", renderTurnstile, { once: true });
        }
        return;
      }

      const script = document.createElement("script");
      script.id = TURNSTILE_SCRIPT_ID;
      script.src = TURNSTILE_SRC;
      script.async = true;
      script.defer = true;
      script.onload = renderTurnstile;
      document.head.appendChild(script);
    };

    ensureScript();

    return () => {
      if (widgetIdRef.current && window.turnstile?.remove) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, [siteKey]);

  useEffect(() => {
    if (status === "success") {
      setStatusMessage(
        "Thank you. A Seattle advisor will contact you within one business day."
      );
    } else if (status === "error" && !statusMessage) {
      setStatusMessage(
        `We could not submit your request. Please call ${site.phone} for immediate assistance.`
      );
    }
  }, [status, statusMessage]);

  const validate = useCallback((state: FormState) => {
    const nextErrors: Partial<Record<FieldKey, string>> = {};
    if (!state.name.trim()) {
      nextErrors.name = "Please provide your name.";
    }
    if (!state.email.trim()) {
      nextErrors.email = "Please provide your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!state.phone.trim()) {
      nextErrors.phone = "Please provide your phone number.";
    }
    if (!state.projectType.trim()) {
      nextErrors.projectType = "Select or describe your project type.";
    }
    return nextErrors;
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validate(formState);
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      return;
    }

    // Execute invisible captcha if not already done
    if (!captchaTokenRef.current && widgetIdRef.current && window.turnstile?.execute) {
      try {
        // Create a promise that resolves when the captcha callback fires
        const captchaPromise = new Promise<string>((resolve, reject) => {
          captchaPromiseRef.current = { resolve, reject };
          window.turnstile?.execute?.(widgetIdRef.current);
        });

        // Wait for captcha with timeout
        const token = await Promise.race([
          captchaPromise,
          new Promise<string>((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 10000)
          ),
        ]);

        captchaTokenRef.current = token;
        setCaptchaToken(token);
      } catch (error) {
        setStatus("error");
        setStatusMessage("Please wait for verification to complete.");
        captchaPromiseRef.current = null;
        return;
      }
    }

    if (!captchaTokenRef.current) {
      setStatus("error");
      setStatusMessage("Please complete the CAPTCHA before submitting.");
      return;
    }

    setStatus("submitting");
    setStatusMessage("");

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formState,
          source,
          "cf-turnstile-response": captchaTokenRef.current,
        }),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setStatus("success");
      setFormState({
        ...initialFormState,
        projectType: defaultProjectType,
      });
      setErrors({});
      captchaTokenRef.current = null;
      setCaptchaToken(null);
      onSuccess?.();
      if (widgetIdRef.current && window.turnstile?.reset) {
        window.turnstile.reset(widgetIdRef.current);
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      setStatusMessage(
        `We could not submit your request. Please call ${site.phone} for immediate assistance.`
      );
      if (widgetIdRef.current && window.turnstile?.reset) {
        window.turnstile.reset(widgetIdRef.current);
      }
    }
  };

  const onFieldChange =
    (field: FieldKey) =>
    (value: string) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => {
        if (!prev[field]) {
          return prev;
        }
        const next = { ...prev };
        delete next[field];
        return next;
      });
    };

  const onTimelineChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setFormState((prev) => ({ ...prev, timeline: value }));
  };

  const isSubmitDisabled =
    status === "submitting" || !captchaToken || !siteKey;

  return (
    <form
      id={formId}
      className="space-y-6"
      noValidate
      onSubmit={handleSubmit}
      aria-describedby={statusMessage ? statusId : undefined}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          id={`${formId}-name`}
          label="Name"
          required
          value={formState.name}
          error={errors.name}
          onChange={onFieldChange("name")}
          autoComplete="name"
        />
        <Field
          id={`${formId}-company`}
          label="Company"
          value={formState.company}
          onChange={onFieldChange("company")}
          autoComplete="organization"
        />
        <Field
          id={`${formId}-email`}
          label="Email"
          type="email"
          required
          value={formState.email}
          error={errors.email}
          onChange={onFieldChange("email")}
          autoComplete="email"
        />
        <Field
          id={`${formId}-phone`}
          label="Phone"
          type="tel"
          required
          value={formState.phone}
          error={errors.phone}
          onChange={onFieldChange("phone")}
          autoComplete="tel"
        />
        <Field
          id={`${formId}-project-type`}
          label="Project Type"
          required
          value={formState.projectType}
          error={errors.projectType}
          onChange={onFieldChange("projectType")}
          list={datalistId}
          placeholder="Example: Puget Sound NNN acquisition"
        />
        <SelectField
          id={`${formId}-timeline`}
          label="Timeline"
          value={formState.timeline}
          onChange={onTimelineChange}
          options={timelineOptions}
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor={`${formId}-details`}
          className="text-sm font-semibold text-[#1F3C58]"
        >
          Details <span className="text-xs text-[#1F3C58]/70">(optional)</span>
        </label>
        <textarea
          id={`${formId}-details`}
          value={formState.details}
          onChange={(event) => onFieldChange("details")(event.target.value)}
          rows={6}
          className="w-full rounded-3xl border border-[#1F3C58]/20 px-4 py-3 text-sm text-[#0E2536] focus:border-[#4DA49B] focus:outline-none focus:ring-2 focus:ring-[#4DA49B]/40"
          placeholder="Share target cap rates, asset classes, and any deadlines."
        />
      </div>
      <datalist id={datalistId}>
        {projectTypeOptions.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
      <div className="space-y-4">
        <div
          ref={turnstileContainerRef}
          className="hidden"
          aria-live="polite"
        />
        {!siteKey && (
          <p className="text-sm text-[#AA3A3A]">
            CAPTCHA unavailable. Set NEXT_PUBLIC_TURNSTILE_SITE_KEY to enable
            submissions.
          </p>
        )}
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="w-full rounded-full bg-gradient-to-r from-[#4DA49B] to-[#7BC5BD] px-6 py-3 text-sm font-semibold uppercase tracking-[0.26em] text-[#0E2536] shadow-[0_18px_48px_-26px_rgba(77,164,155,0.75)] transition hover:shadow-[0_24px_55px_-20px_rgba(77,164,155,0.85)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "Submitting…" : "Start Conversation"}
        </button>
        {statusMessage && (
          <p
            id={statusId}
            className={`text-sm ${
              status === "error" ? "text-[#AA3A3A]" : "text-[#1F3C58]"
            }`}
          >
            {statusMessage}
          </p>
        )}
        <p className="text-xs text-[#1B1B1B]/60">
          Educational content only. Consult your Qualified Intermediary, CPA,
          and legal counsel before executing exchange strategies.
        </p>
      </div>
    </form>
  );
};

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  error?: string;
  autoComplete?: string;
  placeholder?: string;
  list?: string;
}

const Field = ({
  id,
  label,
  value,
  onChange,
  type = "text",
  required = false,
  error,
  autoComplete,
  placeholder,
  list,
}: FieldProps) => (
  <div className="space-y-2">
    <label
      htmlFor={id}
      className="text-sm font-semibold text-[#1F3C58]"
    >
      {label}
      {required && <span className="ml-1 text-xs text-[#AA3A3A]">*</span>}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      required={required}
      autoComplete={autoComplete}
      placeholder={placeholder}
      list={list}
      className={`w-full rounded-2xl border px-3 py-3 text-sm text-[#0E2536] focus:border-[#4DA49B] focus:outline-none focus:ring-2 focus:ring-[#4DA49B]/40 ${
        error ? "border-[#AA3A3A]" : "border-[#1F3C58]/20"
      }`}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
    />
    {error && (
      <span id={`${id}-error`} className="text-xs text-[#AA3A3A]">
        {error}
      </span>
    )}
  </div>
);

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

const SelectField = ({
  id,
  label,
  value,
  options,
  onChange,
}: SelectFieldProps) => (
  <div className="space-y-2">
    <label
      htmlFor={id}
      className="text-sm font-semibold text-[#1F3C58]"
    >
      {label} <span className="text-xs text-[#1F3C58]/70">(optional)</span>
    </label>
    <div className="relative bg-white rounded-2xl" style={{ backgroundColor: '#ffffff' }}>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="w-full rounded-2xl border border-[#1F3C58]/20 bg-white px-3 py-3 text-sm text-[#0E2536] focus:border-[#4DA49B] focus:outline-none focus:ring-2 focus:ring-[#4DA49B]/40 appearance-none"
        style={{ 
          backgroundColor: '#ffffff',
          backgroundImage: 'none',
          opacity: '1',
        }}
      >
        <option value="" style={{ backgroundColor: '#ffffff', color: '#0E2536' }}>Select timeline</option>
        {options.map((option) => (
          <option key={option} value={option} style={{ backgroundColor: '#ffffff', color: '#0E2536' }}>
            {option}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <svg className="h-5 w-5 text-[#1F3C58]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
);

export default ContactForm;

