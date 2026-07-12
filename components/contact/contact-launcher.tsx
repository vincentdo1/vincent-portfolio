"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

const contactDialogLoader = () =>
  import("@/components/sections/contact-dialog").then(
    (mod) => mod.ContactDialog,
  );

const ContactDialog = dynamic(contactDialogLoader, { ssr: false });

function preload() {
  contactDialogLoader().catch(() => {});
}

interface ContactLauncherProps {
  label: string;
  className?: string;
}

export function ContactLauncher({ label, className }: ContactLauncherProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  return (
    <>
      <button
        type="button"
        onPointerEnter={preload}
        onFocus={preload}
        onClick={() => {
          setMounted(true);
          setOpen(true);
        }}
        className={cn(
          "inline-flex items-center justify-center gap-2 h-12 px-6 tactical-shape",
          "bg-primary text-primary-foreground font-mono text-xs uppercase tracking-[0.25em]",
          "hover:bg-primary/90 transition-colors",
          className,
        )}
      >
        <Send className="h-3 w-3" />
        {label}
      </button>

      {mounted && <ContactDialog open={open} onClose={() => setOpen(false)} />}
    </>
  );
}
