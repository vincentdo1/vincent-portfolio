"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Mail, Loader2, AlertCircle } from "lucide-react";
import { CornerBrackets } from "@/components/valorant/corner-brackets";
import { cn } from "@/lib/utils";

interface ContactDialogProps {
  open: boolean;
  onClose: () => void;
}

const RECIPIENT = "vincentdo306@gmail.com";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Quick-message popup that posts to /api/contact (Resend-backed).
 * Setup for the Resend API key lives in app/api/contact/route.ts.
 * A direct mailto: link is also offered as a fallback.
 */
export function ContactDialog({ open, onClose }: ContactDialogProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    // Honeypot — bots fill anything they see; humans never touch this.
    company: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Record when the dialog opened — submissions that arrive faster than
  // a human could possibly type are dropped server-side. A ref avoids
  // pointless re-renders when the timestamp changes.
  const openedAtRef = useRef<number>(0);
  useEffect(() => {
    if (open) openedAtRef.current = Date.now();
  }, [open]);

  // close on Escape (disabled while sending so user doesn't lose draft mid-send)
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && status !== "sending") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose, status]);

  // lock body scroll when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, openedAt: openedAtRef.current }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!res.ok) {
        setErrorMsg(data.error || `Request failed (${res.status})`);
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Network error";
      setErrorMsg(msg);
      setStatus("error");
    }
  }

  function handleClose() {
    if (status === "sending") return;
    onClose();
    // reset a moment after close so transition isn't jumpy
    setTimeout(() => {
      setStatus("idle");
      setErrorMsg(null);
      setForm({ name: "", email: "", message: "", company: "" });
    }, 250);
  }

  const sending = status === "sending";

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-dialog-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="absolute inset-0 bg-background/85 backdrop-blur-md"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative z-10 w-full max-w-lg border border-border bg-card p-6 lg:p-8"
          >
            <CornerBrackets size={14} thickness={1.5} />

            <button
              onClick={handleClose}
              disabled={sending}
              className="absolute top-3 right-3 p-2 text-muted-foreground hover:text-primary transition-colors disabled:opacity-30"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            {status === "sent" ? (
              <div className="py-8 text-center">
                <div className="font-display text-5xl text-primary mb-2">✓</div>
                <div className="font-mono text-xs uppercase tracking-[0.25em] text-primary mb-3">
                  Message Sent
                </div>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                  Thanks for reaching out — I&apos;ll get back to you soon.
                </p>
                <button
                  onClick={handleClose}
                  className={cn(
                    "inline-flex items-center gap-2 h-10 px-5 tactical-shape",
                    "bg-primary text-primary-foreground font-mono text-[11px]",
                    "uppercase tracking-[0.25em] hover:bg-primary/90 transition-colors"
                  )}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary mb-2 flex items-center gap-3">
                    <span className="h-px w-6 bg-primary" />
                    Quick Message
                  </div>
                  <h3
                    id="contact-dialog-title"
                    className="font-display text-3xl md:text-4xl uppercase leading-none"
                  >
                    Get in <span className="text-primary">Touch_</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                    Fill this out and it&apos;ll land straight in my inbox.
                  </p>
                </div>

                <div className="grid gap-4">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5"
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
                      placeholder="Your name"
                      className="w-full h-10 px-3 bg-background border border-border focus:border-primary outline-none text-sm font-mono placeholder:text-muted-foreground/50 transition-colors disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5"
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
                      placeholder="you@example.com"
                      className="w-full h-10 px-3 bg-background border border-border focus:border-primary outline-none text-sm font-mono placeholder:text-muted-foreground/50 transition-colors disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5"
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
                      placeholder="What's up?"
                      rows={5}
                      className="w-full px-3 py-2 bg-background border border-border focus:border-primary outline-none text-sm font-mono placeholder:text-muted-foreground/50 transition-colors resize-none disabled:opacity-60"
                    />
                  </div>

                  {/* Honeypot field — hidden from humans, irresistible to bots */}
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
                  <div className="mt-4 flex items-start gap-2 p-3 border border-destructive/40 bg-destructive/10 text-destructive">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <div className="text-xs font-mono leading-relaxed">
                      {errorMsg}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex items-center justify-between gap-3">
                  <a
                    href={`mailto:${RECIPIENT}`}
                    className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="h-3 w-3" />
                    Or email directly
                  </a>
                  <button
                    type="submit"
                    disabled={sending}
                    className={cn(
                      "relative inline-flex items-center gap-2 h-10 px-5 tactical-shape",
                      "bg-primary text-primary-foreground font-mono text-[11px]",
                      "uppercase tracking-[0.25em] hover:bg-primary/90 transition-colors",
                      "disabled:opacity-60 disabled:cursor-wait",
                      "group overflow-hidden"
                    )}
                  >
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                    <span className="relative z-10 inline-flex items-center gap-2">
                      {sending ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Sending
                        </>
                      ) : (
                        <>
                          <Send className="h-3 w-3" />
                          Send
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
