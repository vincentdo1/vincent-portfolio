"use client";

import { useEffect, useRef, useState } from "react";
import { X, Send, Mail, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/lib/content";

interface ContactDialogProps {
  open: boolean;
  onClose: () => void;
}

type Status = "idle" | "sending" | "sent" | "error";

export function ContactDialog({ open, onClose }: ContactDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    company: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const sending = status === "sending";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      // Form dialogs focus their first field (WAI-ARIA dialog pattern);
      // showModal would otherwise land on the close button.
      dialog.querySelector<HTMLInputElement>("#contact-name")?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    setStatus("sending");
    setErrorMsg(null);

    const controller = new AbortController();
    abortRef.current = controller;
    const timeout = setTimeout(() => controller.abort("timeout"), 15_000);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        signal: controller.signal,
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      if (controller.signal.reason === "close") return;
      setErrorMsg(
        controller.signal.reason === "timeout"
          ? "The request took too long. Please retry, or email me directly."
          : "Network error — please check your connection and retry.",
      );
      setStatus("error");
    } finally {
      clearTimeout(timeout);
    }
  }

  function handleClose() {
    abortRef.current?.abort("close");
    onClose();
    setTimeout(() => {
      setStatus("idle");
      setErrorMsg(null);
      setForm({ name: "", email: "", message: "", company: "" });
    }, 200);
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      aria-labelledby="contact-dialog-title"
      className="m-auto w-[calc(100%-2rem)] max-w-lg border border-border bg-card text-foreground p-6 lg:p-8 backdrop:bg-transparent"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <span className="absolute top-0 left-0 h-3.5 w-3.5 border-t-[1.5px] border-l-[1.5px] border-primary" />
        <span className="absolute top-0 right-0 h-3.5 w-3.5 border-t-[1.5px] border-r-[1.5px] border-primary" />
        <span className="absolute bottom-0 left-0 h-3.5 w-3.5 border-b-[1.5px] border-l-[1.5px] border-primary" />
        <span className="absolute bottom-0 right-0 h-3.5 w-3.5 border-b-[1.5px] border-r-[1.5px] border-primary" />
      </div>

      <button
        onClick={handleClose}
        className="absolute top-2 right-2 flex h-11 w-11 items-center justify-center text-muted-foreground hover:text-primary transition-colors"
        aria-label="Close dialog"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="mb-6">
        <div className="font-mono text-xs uppercase tracking-[0.25em] text-primary mb-2 flex items-center gap-3">
          <span className="h-px w-6 bg-primary" />
          Quick message
        </div>
        <h3
          id="contact-dialog-title"
          className="font-display text-3xl md:text-4xl uppercase leading-none"
        >
          Get in <span className="text-primary">Touch_</span>
        </h3>
      </div>

      {status === "sent" ? (
        <div role="status" className="py-6 text-center">
          <div className="font-display text-5xl text-primary mb-2">✓</div>
          <div className="font-mono text-xs uppercase tracking-[0.25em] text-primary mb-3">
            Message sent
          </div>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Thanks for reaching out — I&apos;ll get back to you soon.
          </p>
          <button
            onClick={handleClose}
            className={cn(
              "inline-flex items-center gap-2 h-11 px-5 tactical-shape",
              "bg-primary text-primary-foreground font-mono text-xs",
              "uppercase tracking-[0.25em] hover:bg-primary/90 transition-colors",
            )}
          >
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Send a role, team, or project note and it&apos;ll land in my inbox.
          </p>

          <div className="grid gap-4">
            <div>
              <label
                htmlFor="contact-name"
                className="block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1.5"
              >
                Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                disabled={sending}
                maxLength={200}
                autoComplete="name"
                placeholder="Your name"
                className="w-full h-11 px-3 bg-background border border-border focus:border-primary text-sm font-mono placeholder:text-muted-foreground/50 transition-colors disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1.5"
              >
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                disabled={sending}
                maxLength={320}
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full h-11 px-3 bg-background border border-border focus:border-primary text-sm font-mono placeholder:text-muted-foreground/50 transition-colors disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1.5"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                disabled={sending}
                maxLength={5000}
                placeholder="Tell me what you're hiring for."
                rows={5}
                className="w-full px-3 py-2 bg-background border border-border focus:border-primary text-sm font-mono placeholder:text-muted-foreground/50 transition-colors resize-none disabled:opacity-60"
              />
            </div>

            <div
              aria-hidden="true"
              className="absolute -left-[9999px] opacity-0 pointer-events-none"
            >
              <label htmlFor="contact-company">
                Company (leave this blank)
              </label>
              <input
                id="contact-company"
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.company}
                onChange={handleChange}
              />
            </div>
          </div>

          {status === "error" && errorMsg && (
            <div
              role="alert"
              className="mt-4 flex items-start gap-2 p-3 border border-destructive/40 bg-destructive/10 text-destructive"
            >
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <div className="text-xs font-mono leading-relaxed">
                {errorMsg}
              </div>
            </div>
          )}

          <p className="mt-4 text-xs text-muted-foreground/80 leading-relaxed">
            Used only to reply to you. Delivered through an email provider —
            never added to a list.
          </p>

          <div className="mt-4 flex items-center justify-between gap-3">
            <a
              href={`mailto:${site.email}`}
              className="inline-flex min-h-11 items-center gap-2 py-2 text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="h-3 w-3" />
              Or email directly
            </a>
            <button
              type="submit"
              disabled={sending}
              className={cn(
                "inline-flex items-center gap-2 h-11 px-5 tactical-shape",
                "bg-primary text-primary-foreground font-mono text-xs",
                "uppercase tracking-[0.25em] hover:bg-primary/90 transition-colors",
                "disabled:opacity-60 disabled:cursor-wait",
              )}
            >
              {sending ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span role="status">Sending</span>
                </>
              ) : (
                <>
                  <Send className="h-3 w-3" />
                  Send
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </dialog>
  );
}
