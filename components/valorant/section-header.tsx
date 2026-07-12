import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  number: string;
  label: string;
  title: React.ReactNode;
  description?: string;
  className?: string;
}

export function SectionHeader({
  number,
  label,
  title,
  description,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-12", className)} data-reveal>
      <div className="flex items-center gap-4 mb-4">
        <div className="font-mono text-xs text-primary">{number}</div>
        <div className="h-px w-12 bg-primary" />
        <div className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </div>
      </div>
      <h2 className="font-display text-5xl md:text-7xl lg:text-8xl uppercase leading-none">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground max-w-lg mt-4">{description}</p>
      )}
    </div>
  );
}
