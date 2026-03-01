"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { getApiErrorMessage } from "@/lib/api";

type RegisterField =
  | "fullName"
  | "email"
  | "password"
  | "confirmPassword"
  | "intent"
  | "consent";

type RegisterErrors = Partial<Record<RegisterField, string>>;

interface RegisterFormState {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  intent: string;
  consent: boolean;
}

const INTENTS = [
  {
    id: "archive",
    label: "Archive My Story",
    preview: "A curated memory vault for the people who know your voice.",
  },
  {
    id: "legacy",
    label: "Build Family Legacy",
    preview: "A structured timeline your family can return to across generations.",
  },
  {
    id: "quiet",
    label: "Keep It Private",
    preview: "A private space that stays sealed until you decide otherwise.",
  },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function evaluatePassword(password: string) {
  const hasLength = password.length >= 8;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const score = [hasLength, hasLetter, hasNumber].filter(Boolean).length;

  return {
    hasLength,
    hasLetter,
    hasNumber,
    score,
    valid: hasLength && hasLetter && hasNumber,
  };
}

function validateForm(values: RegisterFormState): RegisterErrors {
  const errors: RegisterErrors = {};
  const passwordCheck = evaluatePassword(values.password);

  if (!values.fullName.trim() || values.fullName.trim().length < 2) {
    errors.fullName = "Enter your full name.";
  }

  if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!passwordCheck.valid) {
    errors.password = "Use at least 8 characters with letters and numbers.";
  }

  if (values.confirmPassword !== values.password || !values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (!values.intent) {
    errors.intent = "Select how you want to begin.";
  }

  if (!values.consent) {
    errors.consent = "You need to accept this to continue.";
  }

  return errors;
}

export default function RegisterPage() {
  const router = useRouter();
  const auth = useAuth();

  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const intentRef = useRef<HTMLButtonElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<RegisterFormState>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    intent: "",
    consent: false,
  });
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [touched, setTouched] = useState<Partial<Record<RegisterField, boolean>>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const passwordState = useMemo(() => evaluatePassword(form.password), [form.password]);
  const previewIntent = INTENTS.find((intent) => intent.id === form.intent);

  // Redirect if already logged in
  useEffect(() => {
    if (!auth.isLoading && auth.user) {
      router.replace("/dashboard");
    }
  }, [auth.isLoading, auth.user, router]);

  function setField<K extends keyof RegisterFormState>(field: K, value: RegisterFormState[K]) {
    const next = { ...form, [field]: value };
    setForm(next);
    if (touched[field]) {
      setErrors(validateForm(next));
    }
  }

  function touchField(field: RegisterField) {
    const nextTouched = { ...touched, [field]: true };
    setTouched(nextTouched);
    setErrors(validateForm(form));
  }

  function focusFirstError(nextErrors: RegisterErrors) {
    const order: RegisterField[] = [
      "fullName",
      "email",
      "password",
      "confirmPassword",
      "intent",
      "consent",
    ];

    for (const field of order) {
      if (!nextErrors[field]) continue;
      if (field === "fullName") fullNameRef.current?.focus();
      if (field === "email") emailRef.current?.focus();
      if (field === "password") passwordRef.current?.focus();
      if (field === "confirmPassword") confirmPasswordRef.current?.focus();
      if (field === "intent") intentRef.current?.focus();
      if (field === "consent") consentRef.current?.focus();
      break;
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting || auth.isLoading) return;
    setServerError(null);

    const nextTouched: Partial<Record<RegisterField, boolean>> = {
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
      intent: true,
      consent: true,
    };

    setTouched(nextTouched);
    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(nextErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await auth.register({
        full_name: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        confirm_password: form.confirmPassword,
        intent: form.intent,
        consent: form.consent,
      });
      router.push("/onboarding");
    } catch (error) {
      setServerError(getApiErrorMessage(error, "Registration failed"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen pt-28 pb-16 px-6 md:px-12 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_55%_at_22%_55%,rgba(201,168,76,0.1)_0%,transparent_70%),radial-gradient(ellipse_40%_45%_at_80%_20%,rgba(201,168,76,0.08)_0%,transparent_70%)]" />

      <div className="relative z-2 max-w-[1140px] mx-auto grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-7 lg:gap-10">
        <section className="relative border border-border bg-[linear-gradient(150deg,rgba(17,17,17,0.95)_0%,rgba(10,10,10,0.9)_100%)] p-8 md:p-10 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2">
              <div className="auth-orbit relative w-[290px] h-[290px] md:w-[360px] md:h-[360px] border border-gold/20 rounded-full">
                <div className="auth-orbit-pulse absolute inset-[20px] border border-gold/20 rounded-full" />
                <div className="absolute inset-[70px] border border-gold/15 rounded-full" />
              </div>
            </div>
            <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
          </div>

          <p className="relative text-[10px] tracking-[5px] text-gold uppercase mb-6">
            Account Creation
          </p>

          <h1 className="relative font-serif text-[clamp(40px,6vw,74px)] font-light leading-[0.9] mb-6">
            Legacy starts
            <br />
            with <em className="italic text-gold">identity</em>
          </h1>

          <p className="relative text-[12px] tracking-[1px] text-muted leading-8 max-w-[420px] mb-8">
            This first layer creates your private entry point. The details you
            add now shape how your voice, memory, and rituals are preserved.
          </p>

          <div className="relative bg-surface/80 border border-border p-6 md:p-7 max-w-[470px]">
            <div className="text-[9px] tracking-[3px] uppercase text-gold mb-4">
              Live Preview
            </div>
            <div className="font-serif text-[28px] leading-none mb-3">
              {form.fullName.trim() || "Your Name"}
            </div>
            <div className="text-[11px] tracking-[2px] uppercase text-muted mb-3">
              {previewIntent ? previewIntent.label : "Intent not selected"}
            </div>
            <p className="text-[11px] text-muted leading-7">
              {previewIntent
                ? previewIntent.preview
                : "Select a direction to preview how your memorial entry is framed."}
            </p>
          </div>
        </section>

        <section className="border border-border bg-surface/90 p-8 md:p-10">
          <div className="text-[9px] tracking-[4px] uppercase text-gold mb-3">
            Step 01
          </div>
          <h2 className="font-serif text-[42px] md:text-[48px] font-light leading-none mb-6">
            Register
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Field label="Full Name" error={touched.fullName ? errors.fullName : undefined}>
              <input
                ref={fullNameRef}
                type="text"
                value={form.fullName}
                onChange={(event) => setField("fullName", event.target.value)}
                onBlur={() => touchField("fullName")}
                placeholder="James Emmanuel Okonkwo"
                autoComplete="name"
              />
            </Field>

            <Field label="Email" error={touched.email ? errors.email : undefined}>
              <input
                ref={emailRef}
                type="email"
                value={form.email}
                onChange={(event) => setField("email", event.target.value)}
                onBlur={() => touchField("email")}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </Field>

            <Field label="Password" error={touched.password ? errors.password : undefined}>
              <input
                ref={passwordRef}
                type="password"
                value={form.password}
                onChange={(event) => setField("password", event.target.value)}
                onBlur={() => touchField("password")}
                placeholder="At least 8 characters"
                autoComplete="new-password"
              />
              <div className="mt-2">
                <div className="flex gap-1">
                  {[0, 1, 2].map((index) => (
                    <span
                      key={index}
                      className={`h-1 flex-1 transition-colors ${
                        passwordState.score > index ? "bg-gold" : "bg-border"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[9px] tracking-[1px] text-muted mt-1">
                  {passwordState.score === 0 && "Password strength: empty"}
                  {passwordState.score === 1 && "Password strength: weak"}
                  {passwordState.score === 2 && "Password strength: fair"}
                  {passwordState.score === 3 && "Password strength: strong"}
                </p>
              </div>
            </Field>

            <Field
              label="Confirm Password"
              error={touched.confirmPassword ? errors.confirmPassword : undefined}
            >
              <input
                ref={confirmPasswordRef}
                type="password"
                value={form.confirmPassword}
                onChange={(event) => setField("confirmPassword", event.target.value)}
                onBlur={() => touchField("confirmPassword")}
                placeholder="Repeat password"
                autoComplete="new-password"
              />
            </Field>

            <div>
              <label className="text-[9px] tracking-[3px] uppercase text-muted block mb-2">
                Intent
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {INTENTS.map((intent, index) => {
                  const selected = form.intent === intent.id;
                  return (
                    <button
                      key={intent.id}
                      ref={index === 0 ? intentRef : undefined}
                      type="button"
                      onClick={() => {
                        setField("intent", intent.id);
                        setTouched((prev) => ({ ...prev, intent: true }));
                        setErrors(validateForm({ ...form, intent: intent.id }));
                      }}
                      onBlur={() => touchField("intent")}
                      className={`px-3 py-3 border text-[9px] tracking-[2px] uppercase text-left transition-colors ${
                        selected
                          ? "border-gold bg-gold-dim text-gold"
                          : "border-border text-muted hover:border-gold hover:text-gold"
                      }`}
                    >
                      {intent.label}
                    </button>
                  );
                })}
              </div>
              {touched.intent && errors.intent && (
                <p className="text-[10px] text-[#d38787] mt-2">{errors.intent}</p>
              )}
            </div>

            <div>
              <label className="flex items-start gap-3 text-[11px] text-muted leading-6 cursor-pointer">
                <input
                  ref={consentRef}
                  type="checkbox"
                  checked={form.consent}
                  onChange={(event) => setField("consent", event.target.checked)}
                  onBlur={() => touchField("consent")}
                />
                <span>
                  I understand this account controls how my private legacy data
                  is saved and accessed.
                </span>
              </label>
              {touched.consent && errors.consent && (
                <p className="text-[10px] text-[#d38787] mt-1">{errors.consent}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || auth.isLoading}
              className="w-full bg-gold text-black px-8 py-4 text-[10px] tracking-[4px] uppercase font-normal transition-all duration-300 hover:bg-gold-light hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(201,168,76,0.28)] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? "Preparing Your Onboarding..." : "Create Account"}
            </button>
            {serverError && (
              <p className="text-[10px] text-[#d38787]">{serverError}</p>
            )}
          </form>

          <p className="text-[11px] text-muted mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-gold hover:text-gold-light">
              Login
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-[9px] tracking-[3px] uppercase text-muted block mb-2">
        {label}
      </label>
      {children}
      {error && <p className="text-[10px] text-[#d38787] mt-2">{error}</p>}
    </div>
  );
}
