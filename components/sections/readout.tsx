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
        // gap-px over a bordered background paints the dividers, so the cells
        // stay equal width whatever the content length
        "grid grid-cols-3 gap-px border border-border/60 bg-border/60",
        className,
      )}
    >
      {items.map((r) => (
        <div
          key={r.label}
          className="bg-background px-3 py-2.5 sm:px-4 sm:py-3"
        >
          <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            {r.label}
          </dt>
          <dd className="font-display text-base sm:text-lg uppercase text-primary leading-tight mt-1 break-words hyphens-none">
            {r.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
