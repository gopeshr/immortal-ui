"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

type LoginField = "email" | "password";
type LoginErrors = Partial<Record<LoginField, string>>;

interface LoginFormState {
  email: string;
  password: string;
  remember: boolean;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validPassword(value: string) {
  return value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value);
}

function validate(values: LoginFormState): LoginErrors {
  const errors: LoginErrors = {};

  if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!validPassword(values.password)) {
    errors.password = "Use your password with letters and numbers.";
  }

  return errors;
}

export default function LoginPage() {
  const router = useRouter();
  const timerRef = useRef<number | null>(null);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<LoginFormState>({
    email: "",
    password: "",
    remember: true,
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [touched, setTouched] = useState<Partial<Record<LoginField, boolean>>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  function setField(field: keyof LoginFormState, value: string | boolean) {
    const next = { ...form, [field]: value } as LoginFormState;
    setForm(next);
    if (field !== "remember" && touched[field]) {
      setErrors(validate(next));
    }
  }

  function touchField(field: LoginField) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(form));
  }

  function focusFirstError(nextErrors: LoginErrors) {
    if (nextErrors.email) {
      emailRef.current?.focus();
      return;
    }

    if (nextErrors.password) {
      passwordRef.current?.focus();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setTouched({ email: true, password: true });
    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(nextErrors);
      return;
    }

    setIsSubmitting(true);
    timerRef.current = window.setTimeout(() => {
      router.push("/dashboard");
    }, 700);
  }

  return (
    <div className="relative min-h-screen pt-28 pb-16 px-6 md:px-12 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_42%_50%_at_78%_50%,rgba(201,168,76,0.1)_0%,transparent_72%),radial-gradient(ellipse_28%_38%_at_14%_24%,rgba(201,168,76,0.07)_0%,transparent_75%)]" />

      <div className="relative z-2 max-w-[1050px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-7 lg:gap-10">
        <section className="relative border border-border bg-[linear-gradient(135deg,rgba(17,17,17,0.96)_0%,rgba(10,10,10,0.9)_100%)] p-8 md:p-10 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute right-[-90px] top-[30px] w-[240px] h-[240px] border border-gold/20 rounded-full auth-orbit-pulse" />
            <div className="absolute left-[35%] top-[60%] w-[360px] h-[360px] border border-gold/15 rounded-full auth-orbit" />
            <div className="absolute left-0 right-0 top-[40%] h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          </div>

          <p className="relative text-[10px] tracking-[5px] text-gold uppercase mb-6">
            Returning Member
          </p>

          <h1 className="relative font-serif text-[clamp(40px,6vw,70px)] font-light leading-[0.92] mb-6">
            Re-enter
            <br />
            your <em className="italic text-gold">archive</em>
          </h1>

          <p className="relative text-[12px] tracking-[1px] text-muted leading-8 max-w-[430px]">
            Your account keeps your legacy private while it is still unfolding.
            Sign in to continue shaping what remains.
          </p>
        </section>

        <section className="border border-border bg-surface/90 p-8 md:p-10">
          <div className="text-[9px] tracking-[4px] uppercase text-gold mb-3">
            Step 01
          </div>
          <h2 className="font-serif text-[42px] md:text-[48px] font-light leading-none mb-6">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
                placeholder="Enter password"
                autoComplete="current-password"
              />
            </Field>

            <label className="flex items-center gap-3 text-[11px] text-muted cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={(event) => setField("remember", event.target.checked)}
              />
              Keep me signed in on this device
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gold text-black px-8 py-4 text-[10px] tracking-[4px] uppercase font-normal transition-all duration-300 hover:bg-gold-light hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(201,168,76,0.28)] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="text-[11px] text-muted mt-5">
            New here?{" "}
            <Link href="/register" className="text-gold hover:text-gold-light">
              Create account
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
