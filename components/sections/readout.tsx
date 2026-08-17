import { cn } from "@/lib/utils";
import type { Readout as ReadoutItem } from "@/lib/content";

/**
 * The three-value instrument readout used by the intro, projects, and roles.
 *
 * A fixed three-column grid, not a content-sized `inline-block`: the old
 * version resized with its content, so the same component was a different
 * width on every card and long values ("1,650+ rps", "iOS · Android") pushed
 * their neighbours around or collided at narrow widths.
 *
 * `<dl>` / `<dt>` / `<dd>` because that is what this is — label/value pairs.
 * Screen readers announce it as a definition list instead of loose text.
 */
export function Readout({
  items,
  className,
}: {
  items: readonly ReadoutItem[];
  className?: string;
}) {
  return (
    <dl
      className={cn(
        // One column below 360px. Three fixed columns leaves ~55px of text
        // width per cell, and at 11px mono with 0.16em tracking that is not
        // enough for THROUGHPUT, PHENOTYPES, CANDIDATES or RELOCATION — the
        // labels ran into the next cell and PYTORCH · CUDA broke mid-word.
        // The page's overflow-x-clip hid it from a document-width check.
        //
        // gap-px over a bordered background paints the dividers, so the cells
        // stay equal width whatever the content length.
        "grid grid-cols-1 xs:grid-cols-3 gap-px border border-border/60 bg-border/60",
        className,
      )}
    >
      {items.map((r) => (
        <div
          key={r.label}
          className="bg-background px-3 py-2.5 sm:px-4 sm:py-3 flex items-baseline justify-between gap-3 xs:block"
        >
          {/* tighter tracking in the three-column layout buys back the width
              the labels need; the stacked layout has room for the full 0.16em */}
          <dt className="font-mono text-[11px] uppercase tracking-[0.16em] xs:tracking-[0.08em] sm:tracking-[0.14em] text-muted-foreground">
            {r.label}
          </dt>
          <dd className="font-display text-base sm:text-lg uppercase text-primary leading-tight xs:mt-1 text-right xs:text-left">
            {r.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
