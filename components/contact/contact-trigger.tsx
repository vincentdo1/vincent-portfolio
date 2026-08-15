"use client";

import type { ReactNode } from "react";
import {
  preloadContactDialog,
  useContact,
} from "@/components/contact/contact-provider";
import { site } from "@/lib/content";

type Props = {
  className?: string;
  "aria-label"?: string;
  children: ReactNode;
};

/**
 * A contact CTA that is a real mailto: link in server HTML and upgrades to
 * the shared contact dialog once JavaScript runs. If the dialog can't load,
 * the click falls through to the mailto default — the action never dies.
 */
export function ContactTrigger({
  className,
  "aria-label": ariaLabel,
  children,
}: Props) {
  const contact = useContact();

  return (
    <a
      href={`mailto:${site.email}`}
      className={className}
      aria-label={ariaLabel}
      onPointerEnter={preloadContactDialog}
      onFocus={preloadContactDialog}
      onClick={(event) => {
        if (contact?.open()) event.preventDefault();
      }}
    >
      {children}
    </a>
  );
}
