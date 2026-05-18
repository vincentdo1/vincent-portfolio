"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Nav } from "@/components/nav";
import { Container } from "@/components/zippystarter/container";
import { Github, Linkedin, Mail, MapPin, ArrowLeft, Send } from "lucide-react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const to = "vincentdo306@gmail.com";
    const subject = encodeURIComponent(
      form.subject || `Message from ${form.name}`
    );
    const body = encodeURIComponent(
      `From: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    );
    window.open(`mailto:${to}?subject=${subject}&body=${body}`);
    setStatus("sent");
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Nav />

      <Container
        wrapperClassName="pt-32 pb-24"
        className="mx-auto max-w-7xl"
      >
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "font-mono text-xs mb-10 -ml-2 inline-flex gap-2"
          )}
        >
          <ArrowLeft className="h-3 w-3" /> BACK
        </Link>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Left: info */}
          <div>
            <h1 className="text-5xl md:text-7xl font-display tracking-tighter mb-4 leading-none">
              GET IN
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-foreground">
                TOUCH_
              </span>
            </h1>
            <div className="h-1 w-24 bg-primary mb-8" />
            <p className="text-muted-foreground leading-relaxed mb-10 max-w-sm">
              Whether you want to collaborate, discuss an opportunity, or just
              say hi — I&apos;d love to hear from you.
            </p>

            <div className="space-y-6">
              <a
                href="mailto:vincentdo306@gmail.com"
                className="flex items-center gap-4 group"
              >
                <div className="p-3 border border-border group-hover:border-primary transition-colors bg-card">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-mono text-xs text-muted-foreground uppercase mb-0.5">
                    Email
                  </div>
                  <div className="text-sm group-hover:text-primary transition-colors">
                    vincentdo306@gmail.com
                  </div>
                </div>
              </a>

              <a
                href="https://linkedin.com/in/vincent-do-uiuc"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
              >
                <div className="p-3 border border-border group-hover:border-primary transition-colors bg-card">
                  <Linkedin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-mono text-xs text-muted-foreground uppercase mb-0.5">
                    LinkedIn
                  </div>
                  <div className="text-sm group-hover:text-primary transition-colors">
                    linkedin.com/in/vincent-do-uiuc
                  </div>
                </div>
              </a>

              <a
                href="https://github.com/vincentdo1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
              >
                <div className="p-3 border border-border group-hover:border-primary transition-colors bg-card">
                  <Github className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-mono text-xs text-muted-foreground uppercase mb-0.5">
                    GitHub
                  </div>
                  <div className="text-sm group-hover:text-primary transition-colors">
                    github.com/vincentdo1
                  </div>
                </div>
              </a>

              <div className="flex items-center gap-4">
                <div className="p-3 border border-border bg-card">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-mono text-xs text-muted-foreground uppercase mb-0.5">
                    Location
                  </div>
                  <div className="text-sm">Berkeley, MO</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="relative border border-border bg-card p-8">
            <div className="absolute top-0 left-0 size-4 border-t-2 border-l-2 border-primary" />
            <div className="absolute top-0 right-0 size-4 border-t-2 border-r-2 border-primary" />
            <div className="absolute bottom-0 left-0 size-4 border-b-2 border-l-2 border-primary" />
            <div className="absolute bottom-0 right-0 size-4 border-b-2 border-r-2 border-primary" />

            {status === "sent" ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 gap-4">
                <div className="text-5xl">✓</div>
                <div className="text-2xl font-display">MESSAGE SENT_</div>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Your email client should have opened. I&apos;ll get back to you
                  as soon as possible.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "font-mono text-xs mt-2"
                  )}
                >
                  SEND ANOTHER
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-6">
                <div className="font-mono text-xs text-muted-foreground mb-2">
                  // INITIATE_CONTACT
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-xs font-mono text-muted-foreground uppercase"
                    >
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-xs font-mono text-muted-foreground uppercase"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className="text-xs font-mono text-muted-foreground uppercase"
                  >
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="What's on your mind?"
                    value={form.subject}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-xs font-mono text-muted-foreground uppercase"
                  >
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Write your message here..."
                    className="min-h-[160px]"
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className={cn("w-full uppercase", buttonVariants({ size: "lg" }))}
                >
                  <Send className="size-4" /> Send Message
                </button>

                <p className="text-xs font-mono text-muted-foreground text-center">
                  // opens your default email client
                </p>
              </form>
            )}
          </div>
        </div>
      </Container>

      <Container
        component="footer"
        wrapperClassName="py-8 border-t border-border bg-background"
        className="mx-auto max-w-7xl"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs font-mono text-muted-foreground">
            © {new Date().getFullYear()} VINCENT DO. ALL RIGHTS RESERVED.
          </div>
          <Link
            href="/"
            className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors"
          >
            ← BACK TO HOME
          </Link>
        </div>
      </Container>
    </div>
  );
}
