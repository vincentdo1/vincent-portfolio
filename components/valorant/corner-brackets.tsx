import { cn } from "@/lib/utils";

interface CornerBracketsProps {
  className?: string;
  size?: number;
  color?: string;
  thickness?: number;
}

/**
 * L-shaped bracket accents at the four corners of the parent (which must be relative).
 * Mirrors the corner brackets seen on Valorant HUD panels.
 */
export function CornerBrackets({
  className,
  size = 12,
  color = "var(--primary)",
  thickness = 2,
}: CornerBracketsProps) {
  const style = {
    width: size,
    height: size,
    borderColor: color,
    borderWidth: thickness,
  };

  return (
    <div className={cn("pointer-events-none absolute inset-0", className)} aria-hidden>
      <span
        className="absolute top-0 left-0 border-t border-l"
        style={style}
      />
      <span
        className="absolute top-0 right-0 border-t border-r"
        style={style}
      />
      <span
        className="absolute bottom-0 left-0 border-b border-l"
        style={style}
      />
      <span
        className="absolute bottom-0 right-0 border-b border-r"
        style={style}
      />
    </div>
  );
}
