"use client";

import {
  Component,
  createContext,
  useContext,
  useEffect,
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
  const [broken, setBroken] = useState(false);
  const [ready, setReady] = useState(false);

  /**
   * Load the dialog chunk during idle time, before anyone clicks.
   *
   * `open()` used to return true — and so the trigger called
   * preventDefault() on its own `mailto:` — before this chunk existed. On a
   * slow or failed first request the click did nothing at all: no dialog, and
   * the native fallback already suppressed. Now the chunk is fetched up front
   * and `open()` refuses until it has actually resolved, so the very first
   * click either opens the dialog or follows the mailto during that same user
   * activation. It is a small form; prefetching it costs almost nothing.
   */
  useEffect(() => {
    let cancelled = false;
    const load = () =>
      contactDialogLoader().then(
        () => !cancelled && setReady(true),
        () => !cancelled && setBroken(true),
      );

    const idle = window.requestIdleCallback;
    if (typeof idle === "function") {
      const handle = idle(load, { timeout: 2000 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback?.(handle);
      };
    }
    const timer = window.setTimeout(load, 700);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  const value = useMemo<ContactContextValue>(
    () => ({
      open: () => {
        // not ready yet => let the mailto: through instead of a dead click
        if (broken || !ready) return false;
        setOpen(true);
        return true;
      },
    }),
    [broken, ready],
  );

  return (
    <ContactContext.Provider value={value}>
      {children}
      {ready && !broken && (
        <DialogBoundary onBroken={() => setBroken(true)}>
          <ContactDialog open={open} onClose={() => setOpen(false)} />
        </DialogBoundary>
      )}
    </ContactContext.Provider>
  );
}
