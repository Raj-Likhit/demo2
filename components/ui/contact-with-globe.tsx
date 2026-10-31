"use client";

import { ArrowRight, Mail } from "lucide-react";
import { motion } from "motion/react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { z } from "zod";
import GlobeWireframe from "@/components/ui/globe-wireframe";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { emailHref } from "@/lib/contact";

const phonePattern = /^\+?[0-9][0-9\s().-]*$/;

const contactSchema = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(100, "Keep your name under 100 characters."),
  email: z.string().trim().min(1, "Enter your email address.").email("Enter a valid email address.").max(254, "Enter a shorter email address."),
  phone: z.string().trim().max(32, "Enter a shorter phone number.").refine((value) => {
    if (!value) return true;
    const digits = value.replace(/\D/g, "").length;
    return phonePattern.test(value) && digits >= 7 && digits <= 15;
  }, "Enter a valid phone number, including country code if needed.").optional().default(""),
  company: z.string().trim().max(120, "Keep the company name under 120 characters.").optional().default(""),
  message: z.string().trim().min(1, "Write a message before continuing.").max(3000, "Keep your message under 3,000 characters."),
});

type ContactField = "name" | "email" | "phone" | "company" | "message";
type ContactErrors = Partial<Record<ContactField, string>>;

const fieldBaseClass = "mt-2 w-full rounded-xl border bg-catalyst-paper px-4 py-3.5 text-base leading-6 text-catalyst-ink outline-none transition-colors placeholder:text-catalyst-muted/80 focus:border-catalyst-forest focus:ring-2 focus:ring-catalyst-forest/15";

export default function ContactWithGlobe({
  title = "Let's build what matters",
  subtitle = "Contact",
  description = "Questions, event ideas, or collaboration enquiries? We'd like to hear from you.",
  className,
}: {
  title?: string;
  subtitle?: string;
  description?: string;
  className?: string;
}) {
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<"idle" | "invalid" | "not-connected">("idle");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const readText = (name: ContactField) => {
      const value = formData.get(name);
      return typeof value === "string" ? value : "";
    };
    const values = {
      name: readText("name"),
      email: readText("email"),
      phone: readText("phone"),
      company: readText("company"),
      message: readText("message"),
    };
    const result = contactSchema.safeParse(values);

    if (!result.success) {
      const nextErrors: ContactErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as ContactField | undefined;
        if (field && !nextErrors[field]) nextErrors[field] = issue.message;
      }
      setErrors(nextErrors);
      setStatus("invalid");
      return;
    }

    // Wire this form to NEXT_PUBLIC_CONTACT_FORM_ENDPOINT after the team provides the endpoint.
    setErrors({});
    setStatus("not-connected");
  };

  const clearFieldError = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = event.currentTarget.name as ContactField;
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    setStatus("idle");
  };

  return (
    <section className={cn("relative overflow-hidden bg-catalyst-paper py-24 text-catalyst-ink", className)}>
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="mb-14 text-center">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex rounded-full border border-catalyst-line bg-catalyst-white px-4 py-1.5 text-sm font-medium"
          >
            {subtitle}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-4 text-4xl font-bold tracking-[-0.035em] md:text-6xl"
          >
            {title}
          </motion.h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-catalyst-muted">{description}</p>
        </div>

        <div className="mx-auto grid max-w-5xl items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="flex min-w-0 flex-col gap-7">
            <div>
              <h3 className="text-xl font-semibold">Get in touch</h3>
              <p className="mt-2 max-w-sm text-base leading-7 text-catalyst-muted">
                Reach the team directly by email.
              </p>
            </div>
            <a
              href={emailHref()}
              className="group flex min-h-12 w-fit items-center gap-3 rounded-lg text-base font-medium text-catalyst-ink transition-colors hover:text-catalyst-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-catalyst-forest focus-visible:ring-offset-4"
            >
              <span className="grid size-10 place-items-center rounded-lg border border-catalyst-line bg-catalyst-white group-hover:border-catalyst-forest">
                <Mail size={17} aria-hidden="true" />
              </span>
              contact@devcatalyst.in
            </a>
            <GlobeWireframe
              className="mx-auto aspect-square w-full max-w-[390px]"
              variant="wireframesolid"
              autoRotate
              autoRotateSpeed={0.45}
              strokeWidth={0.6}
              graticuleOpacity={0.12}
            />
          </div>

          <form
            className="flex min-w-0 flex-col gap-5 rounded-2xl border border-catalyst-line bg-catalyst-white p-5 shadow-sm sm:p-8"
            onSubmit={submit}
            noValidate
          >
            <div>
              <h3 className="text-lg font-semibold">Send a message</h3>
              <p className="mt-1 text-sm leading-6 text-catalyst-muted">
                Check your details here. Form delivery will be connected to an endpoint later.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="min-w-0 text-sm font-medium text-catalyst-ink">
                Name <span aria-hidden="true">*</span>
                <input
                  name="name"
                  required
                  autoComplete="name"
                  maxLength={100}
                  className={fieldBaseClass}
                  placeholder="Your name"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "contact-name-error" : undefined}
                  onChange={clearFieldError}
                />
                {errors.name && <span id="contact-name-error" className="mt-1 block text-sm text-red-700">{errors.name}</span>}
              </label>
              <label className="min-w-0 text-sm font-medium text-catalyst-ink">
                Company <span className="font-normal text-catalyst-muted">(optional)</span>
                <input
                  name="company"
                  autoComplete="organization"
                  maxLength={120}
                  className={fieldBaseClass}
                  placeholder="Your company"
                  aria-invalid={Boolean(errors.company)}
                  aria-describedby={errors.company ? "contact-company-error" : undefined}
                  onChange={clearFieldError}
                />
                {errors.company && <span id="contact-company-error" className="mt-1 block text-sm text-red-700">{errors.company}</span>}
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="min-w-0 text-sm font-medium text-catalyst-ink">
                Email <span aria-hidden="true">*</span>
                <input
                  name="email"
                  required
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  className={fieldBaseClass}
                  placeholder="you@example.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "contact-email-error" : undefined}
                  onChange={clearFieldError}
                />
                {errors.email && <span id="contact-email-error" className="mt-1 block text-sm text-red-700">{errors.email}</span>}
              </label>
              <label className="min-w-0 text-sm font-medium text-catalyst-ink">
                Phone number <span className="font-normal text-catalyst-muted">(optional)</span>
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  maxLength={32}
                  className={fieldBaseClass}
                  placeholder="+91 98765 43210"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "contact-phone-error" : "contact-phone-hint"}
                  onChange={clearFieldError}
                />
                {errors.phone ? (
                  <span id="contact-phone-error" className="mt-1 block text-sm text-red-700">{errors.phone}</span>
                ) : (
                  <span id="contact-phone-hint" className="mt-1 block text-xs font-normal text-catalyst-muted">Include a country code if needed.</span>
                )}
              </label>
            </div>

            <label className="text-sm font-medium text-catalyst-ink">
              Message <span aria-hidden="true">*</span>
              <textarea
                name="message"
                required
                rows={5}
                maxLength={3000}
                className={`${fieldBaseClass} min-h-32 resize-y`}
                placeholder="What would you like to talk about?"
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "contact-message-error" : undefined}
                onChange={clearFieldError}
              />
              {errors.message && <span id="contact-message-error" className="mt-1 block text-sm text-red-700">{errors.message}</span>}
            </label>

            <Button
              type="submit"
              className="min-h-12 w-fit rounded-xl bg-catalyst-forest px-6 text-white hover:bg-catalyst-ink focus-visible:ring-2 focus-visible:ring-catalyst-forest focus-visible:ring-offset-4"
            >
              Validate message <ArrowRight className="ml-2" size={16} aria-hidden="true" />
            </Button>
            <p className="text-xs leading-5 text-catalyst-muted" role="note">
              This form does not send or store messages yet. For now, email{" "}
              <a className="font-medium text-catalyst-ink underline underline-offset-2" href={emailHref()}>contact@devcatalyst.in</a>.
            </p>
            {status === "invalid" && (
              <p role="alert" className="text-sm font-medium text-red-700">
                Review the fields marked above, then try again.
              </p>
            )}
            {status === "not-connected" && (
              <p role="status" className="text-sm font-medium text-catalyst-ink">
                Your details are valid, but this form is not connected and nothing was sent. Email contact@devcatalyst.in instead.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
