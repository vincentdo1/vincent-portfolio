"use client";

import {
  Component,
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";

const contactDialogLoader = () =>
  import("@/components/sections/contact-dialog").then(
    (mod) => mod.ContactDialog,
  );

const ContactDialog = dynamic(contactDialogLoader, { ssr: false });

export function preloadContactDialog() {
  contactDialogLoader().catch(() => {});
}

type ContactContextValue = {
  /** Open the shared dialog. Returns false if the dialog can't be used. */
  open: () => boolean;
};

const ContactContext = createContext<ContactContextValue | null>(null);

export function useContact() {
  return useContext(ContactContext);
}

/**
 * If the dialog chunk fails to load or render, mark it broken so every
 * trigger degrades to its plain mailto: default instead of a dead button.
 */
class DialogBoundary extends Component<
  { onBroken: () => void; children: ReactNode },
  { broken: boolean }
> {
  state = { broken: false };

  static getDerivedStateFromError() {
    return { broken: true };
  }

  componentDidCatch() {
    this.props.onBroken();
  }

  render() {
    return this.state.broken ? null : this.props.children;
  }
}

/**
 * One page-level contact dialog shared by every trigger.
 *
 * A single instance means the form-control IDs inside ContactDialog exist at
 * most once in the DOM, no matter how many triggers the page has. Focus
 * restore is the native <dialog> behavior: close() returns focus to whichever
 * trigger opened it.
 */
export function ContactProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [broken, setBroken] = useState(false);

  const value = useMemo<ContactContextValue>(
    () => ({
      open: () => {
        if (broken) return false;
        setMounted(true);
        setOpen(true);
        return true;
      },
    }),
    [broken],
  );

  return (
    <ContactContext.Provider value={value}>
      {children}
      {mounted && (
        <DialogBoundary onBroken={() => setBroken(true)}>
          <ContactDialog open={open} onClose={() => setOpen(false)} />
        </DialogBoundary>
      )}
    </ContactContext.Provider>
  );
}
